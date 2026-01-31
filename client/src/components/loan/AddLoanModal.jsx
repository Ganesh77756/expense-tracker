import { useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function AddLoanModal({ onClose, onRefresh }) {
  const [form, setForm] = useState({
    lenderName: "",
    principal: "",
    interestRate: "",
    tenureMonths: "",
    startDate: "",
    emiDayOfMonth: ""
  });

  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/loans", form);
      toast.success("Loan added successfully");
      onRefresh();
      onClose();
    } catch {
      toast.error("Failed to add loan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Add New Loan</h2>

        <form onSubmit={submit} className="space-y-4">

          <div>
            <label className="text-sm text-slate-600">Lender Name</label>
            <input
              type="text"
              name="lenderName"
              value={form.lenderName}
              onChange={onChange}
              required
              className="w-full border p-2 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Loan Amount (₹)</label>
            <input
              type="number"
              name="principal"
              value={form.principal}
              onChange={onChange}
              required
              className="w-full border p-2 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Interest Rate (%)</label>
            <input
              type="number"
              name="interestRate"
              value={form.interestRate}
              onChange={onChange}
              required
              className="w-full border p-2 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Tenure (Months)</label>
            <input
              type="number"
              name="tenureMonths"
              value={form.tenureMonths}
              onChange={onChange}
              required
              className="w-full border p-2 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={onChange}
              className="w-full border p-2 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">EMI Day of Month</label>
            <input
              type="number"
              name="emiDayOfMonth"
              value={form.emiDayOfMonth}
              onChange={onChange}
              required
              min="1"
              max="31"
              className="w-full border p-2 rounded-lg mt-1"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Loan"}
          </button>
        </form>
      </div>
    </div>
  );
}
