import { useEffect, useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function EMIHistoryModal({ loan, onClose }) {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/loans/${loan._id}/payments`);
      setHistory(res.data || null);
    } catch {
      toast.error("Failed to load EMI history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [loan._id]);

  const payments = history?.payments ?? [];
  const totalPaid = history?.totalPaid ?? 0;
  const remaining = history?.remaining ?? loan.remainingAmount;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-lg relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-slate-500 hover:text-slate-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-1">EMI History</h2>
        <p className="text-sm text-slate-500 mb-4">{loan.lenderName}</p>

        <div className="flex justify-between text-sm mb-4">
          <span className="font-medium">Total Paid: ₹{totalPaid}</span>
          <span className="font-medium text-red-600">
            Remaining: ₹{remaining}
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : payments.length === 0 ? (
          <p className="text-sm text-slate-500">No EMI payments recorded yet.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Date</th>
                  <th className="text-right px-4 py-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {payments.map((p, index) => (
                  <tr
                    key={p._id}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <td className="px-4 py-2">
                      {new Date(p.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      ₹{p.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
