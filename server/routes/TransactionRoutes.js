import express from "express";
import { 
  getDashboard,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getCategorySummary,
  getMonthlySummary,
  getMonthlyCategorySummary,
  searchTransactions
} from "../controllers/TransactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
 
 
router.get("/debug", (req, res) => {
  res.send("Search route file is correct");
});

router.get("/search", protect, searchTransactions);

router.get("/summary", protect, getSummary);
router.get("/summary/category", protect, getCategorySummary);
router.get("/summary/category/monthly", protect, getMonthlyCategorySummary);
router.get("/summary/monthly", protect, getMonthlySummary);
router.get("/dashboard", protect, getDashboard);
 
router.get("/", protect, getTransactions);
router.post("/", protect, createTransaction);

 
router.put("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);

console.log("Transaction routes loaded");

export default router;
