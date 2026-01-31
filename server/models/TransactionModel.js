import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

 
transactionSchema.index(
  { user: 1, amount: 1, category: 1, type: 1, date: 1 },
  { unique: true }
);

 
transactionSchema.index({
  title: "text",
  description: "text",
  category: "text",
  type: "text"
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
