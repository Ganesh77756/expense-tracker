import dotenv from "dotenv";
dotenv.config(); 



import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import transactionRoutes from "./routes/TransactionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/AiRoutes.js";
import loanRoutes from "./routes/LoanRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/loans", loanRoutes);

app.get("/", (req, res) => {
  res.send("FinSight Backend is running");
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
  });
});
