import mongoose from "mongoose";

const loanPaymentSchema = new mongoose.Schema(
  {
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

loanPaymentSchema.index({ loan: 1 });

export default mongoose.model("LoanPayment", loanPaymentSchema);
