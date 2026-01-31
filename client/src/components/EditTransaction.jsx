import React, { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function EditTransaction({ open, tx, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: "",
    type: "expense",
    amount: "",
    category: "",
    date: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tx) {
      setForm({
        title: tx.title || "",
        type: tx.type || "expense",
        amount: tx.amount || "",
        category: tx.category || "",
        date: tx.date ? new Date(tx.date).toISOString().slice(0, 10) : "",
        description: tx.description || ""
      });
    }
  }, [tx]);

  if (!open || !tx) return null;

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        title: form.title,
        type: form.type,
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        description: form.description
      };
      const res = await api.put(`/transactions/${tx._id}`, payload);
      onUpdated(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <form
        onSubmit={submit}
        className="relative bg-white w-full max-w-md rounded-xl p-6 z-10 border border-slate-200"
      >
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Edit Transaction</div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 text-sm"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            required
            placeholder="Title"
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            name="type"
            value={form.type}
            onChange={onChange}
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="income">income</option>
            <option value="expense">expense</option>
          </select>
          <input
            name="amount"
            value={form.amount}
            onChange={onChange}
            required
            placeholder="Amount"
            type="number"
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            name="category"
            value={form.category}
            onChange={onChange}
            required
            placeholder="Category"
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            name="date"
            value={form.date}
            onChange={onChange}
            required
            type="date"
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Description (optional)"
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-100 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-amber-500 text-white text-sm disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
