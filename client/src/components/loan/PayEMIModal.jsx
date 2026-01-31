import { useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function PayEMIModal({ loan, onClose, onRefresh }) {
  const [amount, setAmount] = useState(loan.monthlyEMI);
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  const submitPayment = async () => {
    try {
      setLoading(true);

      await api.patch(`/loans/${loan._id}/pay`, {
        amount,
        paymentDate,
      });

      toast.success("EMI paid successfully");
      onRefresh();
      onClose();
    } catch {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-slate-500 hover:text-slate-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Pay EMI</h2>

        <p className="text-sm text-slate-500 mb-1">Remaining Amount:</p>
        <p className="text-lg font-bold text-red-600 mb-4">
          ₹{loan.remainingAmount}
        </p>

        <label className="text-sm text-slate-600">Payment Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border p-2 rounded-lg mt-1 mb-4"
        />

        <label className="text-sm text-slate-600">Payment Date</label>
        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          className="w-full border p-2 rounded-lg mt-1 mb-4"
        />

        <button
          disabled={loading}
          onClick={submitPayment}
          className="bg-purple-600 text-white w-full py-2 rounded-lg hover:bg-purple-700 disabled:opacity-60"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
