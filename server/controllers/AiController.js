import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import Transaction from "../models/TransactionModel.js";

const openai =
  process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

function parseQuery(message) {
  const msg = message.toLowerCase();
  const months = [
    "january","february","march","april","may","june",
    "july","august","september","october","november","december"
  ];

  let month = null;
  let year = null;
  let category = null;
  let type = null;
  let intent = "total";

  months.forEach((m, i) => {
    if (msg.includes(m)) month = i + 1;
  });

  const yearMatch = msg.match(/20\d{2}/);
  if (yearMatch) year = Number(yearMatch[0]);

  if (msg.includes("last month")) {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    month = d.getMonth() + 1;
    year = d.getFullYear();
  }

  if (month && !year) {
    year = new Date().getFullYear();
  }

  if (
    msg.includes("spend") ||
    msg.includes("spent") ||
    msg.includes("expense") ||
    msg.includes("cost")
  ) {
    type = "expense";
  }

  if (
    msg.includes("earn") ||
    msg.includes("income") ||
    msg.includes("salary")
  ) {
    type = "income";
  }

  const categories = [
    "food","groceries","rent","salary","movies","shopping",
    "medicine","trip","tiffin","pg","pg rent"
  ];

  categories.forEach((c) => {
    if (msg.includes(c)) category = c;
  });

  if (
    (msg.includes("highest") || msg.includes("top") || msg.includes("biggest")) &&
    (msg.includes("category") || msg.includes("spending") || msg.includes("expense"))
  ) {
    intent = "topCategory";
    if (!type) type = "expense";
  }

  return { month, year, category, type, intent };
}

async function getDbTotal(userId, month, year, type, category) {
  const match = { user: userId };

  if (type === "expense") match.type = "expense";
  if (type === "income") match.type = "income";
  if (category) match.category = new RegExp(category, "i");

  if (month && year) {
    match.date = {
      $gte: new Date(year, month - 1, 1),
      $lte: new Date(year, month, 0)
    };
  } else if (year) {
    match.date = {
      $gte: new Date(year, 0, 1),
      $lte: new Date(year, 11, 31)
    };
  }

  const result = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  return result.length > 0 ? result[0].total : 0;
}

async function getTopCategory(userId, month, year) {
  const match = { user: userId, type: "expense" };

  if (month && year) {
    match.date = {
      $gte: new Date(year, month - 1, 1),
      $lte: new Date(year, month, 0)
    };
  }

  const result = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    { $sort: { total: -1 } },
    { $limit: 1 }
  ]);

  if (!result.length) return null;

  return {
    category: result[0]._id,
    total: result[0].total
  };
}

export const chatWithAssistant = async (req, res) => {
  try {
    if (!openai) {
      return res
        .status(500)
        .json({ reply: "AI is not configured on the server. Ask admin to set API key." });
    }

    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ reply: "Please enter a question." });
    }

    const { month, year, type, category, intent } = parseQuery(message);

    let numericAnswer = null;
    let topCategory = null;
    let periodText = "";

    if (month && year) {
      periodText = `${month}/${year}`;

      if (intent === "topCategory") {
        topCategory = await getTopCategory(req.user._id, month, year);
      } else {
        numericAnswer = await getDbTotal(
          req.user._id,
          month,
          year,
          type || "expense",
          category
        );
      }
    }

    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(25);

    const txLines =
      transactions.length === 0
        ? "No transactions yet."
        : transactions
            .map(
              (t) =>
                `${t.date.toISOString().slice(0, 10)} | ${t.type} | ${t.category} | ${t.title} | ₹${t.amount}`
            )
            .join("\n");

    let systemPrompt =
      "You are FinSight AI, a financial assistant. Always answer in INR (₹). For any numeric questions, you must use the values given in 'Database_Total' or 'Database_TopCategory'.";

    let userPrompt = `User question: ${message}\nRecent transactions:\n${txLines}\n`;

    if (numericAnswer !== null && periodText) {
      userPrompt += `Database_Total: ${numericAnswer} for period ${periodText}.\n`;
    }

    if (topCategory && periodText) {
      userPrompt += `Database_TopCategory: ${topCategory.category} with total ${topCategory.total} for period ${periodText}.\n`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 400
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I could not answer that.";

    res.json({ reply });
  } catch (error) {
    res
      .status(500)
      .json({ reply: "Something went wrong while talking to FinSight AI." });
  }
};
