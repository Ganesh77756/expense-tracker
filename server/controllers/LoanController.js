import Loan from "../models/LoanModel.js";
import LoanPayment from "../models/LoanPaymentModel.js";
import Transaction from "../models/TransactionModel.js";

function calculateEMI(principal, rate, months) {
  const monthlyRate = rate / (12 * 100);
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

export const createLoan = async (req, res) => {
  try {
    const { lenderName, principal, interestRate, tenureMonths, startDate, emiDayOfMonth } = req.body;

    const emi = calculateEMI(principal, interestRate, tenureMonths);
    const remaining = emi * tenureMonths;

    const normalizedDate = new Date(startDate);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    const loan = await Loan.create({
      user: req.user._id,
      lenderName,
      principal,
      interestRate,
      tenureMonths,
      startDate: normalizedDate,
      emiDayOfMonth,
      monthlyEMI: Math.round(emi),
      remainingAmount: Math.round(remaining)
    });

    res.json(loan);
  } catch {
    res.status(500).json({ message: "Failed to create loan" });
  }
};

export const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(loans);
  } catch {
    res.status(500).json({ message: "Failed to fetch loans" });
  }
};

export const makePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentDate } = req.body;

    const loan = await Loan.findOne({ _id: id, user: req.user._id });
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    const payDate = paymentDate ? new Date(paymentDate) : new Date();
    payDate.setUTCHours(0, 0, 0, 0);

    await LoanPayment.create({
      loan: id,
      user: req.user._id,
      amount,
      date: payDate
    });

    loan.remainingAmount -= amount;

    if (loan.remainingAmount <= 0) {
      loan.remainingAmount = 0;
      loan.status = "closed";
    }

    await loan.save();

    await Transaction.create({
      user: req.user._id,
      title: `EMI Payment - ${loan.lenderName}`,
      amount: amount,
      category: "EMI",
      type: "expense",
      date: payDate
    });

    res.json(loan);
  } catch {
    res.status(500).json({ message: "Payment update failed" });
  }
};

export const getLoanPayments = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await Loan.findOne({ _id: id, user: req.user._id });
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    const payments = await LoanPayment.find({
      loan: id,
      user: req.user._id
    }).sort({ date: 1 });

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      loanId: id,
      lenderName: loan.lenderName,
      totalPaid,
      remaining: loan.remainingAmount,
      payments
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

export const deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findOneAndDelete({ _id: id, user: req.user._id });
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    res.json({ message: "Loan deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};
