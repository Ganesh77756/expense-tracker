import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    lenderName: {
      type: String,
      required: true
    },

    principal: {
      type: Number,
      required: true
    },

    interestRate: {
      type: Number,
      required: true
    },

    tenureMonths: {
      type: Number,
      required: true
    },

    startDate: {
      type: Date,
      default: Date.now
    },

    emiDayOfMonth: {
      type: Number,
      required: true
    },

    monthlyEMI: {
      type: Number,
      required: true
    },

    remainingAmount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active"
    }
  },
  { timestamps: true }
);

loanSchema.index({ user: 1 });

const Loan = mongoose.model("Loan", loanSchema);
export default Loan;
