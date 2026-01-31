import React, { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function DeleteConfirm({ open, tx, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  if (!open || !tx) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/transactions/${tx._id}`);
      onDeleted(tx._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
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
      <div className="relative bg-white w-full max-w-sm rounded-xl p-6 z-10 border border-slate-200">
        <div className="text-lg font-semibold">Delete transaction</div>
        <div className="mt-3 text-sm text-slate-600">
          Are you sure you want to delete "{tx.title}"? This action cannot be undone.
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-100 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded bg-red-500 text-white text-sm disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
