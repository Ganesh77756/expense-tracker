import express from "express";
import {
  createLoan,
  getLoans,
  makePayment,
  deleteLoan,
  getLoanPayments
} from "../controllers/LoanController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createLoan);
router.get("/", protect, getLoans);
router.get("/:id/payments", protect, getLoanPayments);
router.patch("/:id/pay", protect, makePayment);
router.delete("/:id", protect, deleteLoan);

export default router;
