import Transaction from "../models/TransactionModel.js";

function getDateFilter(month, year) {
  if (!year) return null;
  const y = Number(year);

  if (!month || month === "all") {
    return {
      $gte: new Date(y, 0, 1),
      $lte: new Date(y, 11, 31, 23, 59, 59),
    };
  }

  const m = Number(month);
  return {
    $gte: new Date(y, m - 1, 1),
    $lte: new Date(y, m, 0, 23, 59, 59),
  };
}

export const getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, search, page = 1, limit = 50, month, year } = req.query;

    const filters = [{ user: req.user._id }];

    const dateFilter = getDateFilter(month, year);
    if (dateFilter) {
      filters.push({ date: dateFilter });
    } else if (startDate || endDate) {
      const df = {};
      if (startDate) df.$gte = new Date(startDate);
      if (endDate) df.$lte = new Date(endDate);
      filters.push({ date: df });
    }

    if (type) filters.push({ type: { $regex: `^${type}$`, $options: "i" } });
    if (category) filters.push({ category: { $regex: `^${category}$`, $options: "i" } });

    if (search) {
      const regex = new RegExp(search, "i");
      const amountSearch = !isNaN(search) ? Number(search) : null;

      filters.push({
        $or: [
          { title: regex },
          { description: regex },
          { category: regex },
          { type: regex },
          ...(amountSearch !== null ? [{ amount: amountSearch }] : []),
        ],
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const transactions = await Transaction.find({ $and: filters })
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { title, type, amount, category, date, description } = req.body;

    if (!title || !type || !amount || !category || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const transaction = new Transaction({
      title,
      type,
      amount: Number(amount),
      category: category.trim(),
      date: normalizedDate,
      description,
      user: req.user._id,
    });

    await transaction.save();

    res.json({ message: "Transaction added", transaction });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate transaction not allowed" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Not found" });
    if (transaction.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    Object.assign(transaction, req.body);
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Not found" });
    if (transaction.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted", transaction: deletedTransaction });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const incomeAgg = await Transaction.aggregate([
      { $match: { user: userId, type: "income" } },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
    ]);

    const expenseAgg = await Transaction.aggregate([
      { $match: { user: userId, type: "expense" } },
      { $group: { _id: null, totalExpense: { $sum: "$amount" } } },
    ]);

    const totalIncome = incomeAgg[0]?.totalIncome || 0;
    const totalExpense = expenseAgg[0]?.totalExpense || 0;

    res.json({ totalIncome, totalExpense });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCategorySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.query;

    let match = { user: userId };

    const dateFilter = getDateFilter(month, year);
    if (dateFilter) {
      match.date = dateFilter;
    }

    const categoryAgg = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          type: { $first: "$type" },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    res.json(categoryAgg);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const monthlyAgg = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" }, type: "$type" },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: { year: "$_id.year", month: "$_id.month" },
          totals: { $push: { type: "$_id.type", totalAmount: "$totalAmount" } },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalIncome: {
            $sum: {
              $map: {
                input: { $filter: { input: "$totals", cond: { $eq: ["$$this.type", "income"] } } },
                as: "i",
                in: "$$i.totalAmount",
              },
            },
          },
          totalExpense: {
            $sum: {
              $map: {
                input: { $filter: { input: "$totals", cond: { $eq: ["$$this.type", "expense"] } } },
                as: "e",
                in: "$$e.totalAmount",
              },
            },
          },
        },
      },
      { $sort: { year: -1, month: -1 } },
    ]);

    res.json(monthlyAgg);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const incomeAgg = await Transaction.aggregate([
      { $match: { user: userId, type: "income" } },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
    ]);

    const expenseAgg = await Transaction.aggregate([
      { $match: { user: userId, type: "expense" } },
      { $group: { _id: null, totalExpense: { $sum: "$amount" } } },
    ]);

    const totalIncome = incomeAgg[0]?.totalIncome || 0;
    const totalExpense = expenseAgg[0]?.totalExpense || 0;
    const balance = totalIncome - totalExpense;

    const recent = await Transaction.find({ user: userId })
      .sort({ date: -1 })
      .limit(5);

    res.json({
      summary: { income: totalIncome, expense: totalExpense, balance },
      recent,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const searchTransactions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const results = await Transaction.find(
      {
        user: req.user._id,
        $text: { $search: query },
      },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};

export const getMonthlyCategorySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.query;

    if (!year) {
      return res.status(400).json({ message: "month and year are required" });
    }

    const dateFilter = getDateFilter(month, year);

    const result = await Transaction.aggregate([
      { $match: { user: userId, date: dateFilter } },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          type: { $first: "$type" },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
