import React from "react";

export default function TransactionDetails({ open, tx, onClose }) {
  if (!open || !tx) return null;

  const formattedDate = new Date(tx.date).toLocaleDateString();
  const isIncome = tx.type === "income";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-xl p-6 z-10 border border-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={
                isIncome
                  ? "w-12 h-12 rounded-lg flex items-center justify-center bg-emerald-50"
                  : "w-12 h-12 rounded-lg flex items-center justify-center bg-rose-50"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                stroke={isIncome ? "#16a34a" : "#ef4444"}
                viewBox="0 0 24 24"
              >
                <path
                  d={
                    isIncome
                      ? "M12 19V6M5 12l7-7 7 7"
                      : "M12 5v13M19 12l-7 7-7-7"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <div className="text-lg font-semibold">{tx.title}</div>
              <div className="text-sm text-slate-500">
                {tx.category} • {formattedDate}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 text-sm"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-slate-50 p-4 rounded border border-slate-200">
            <div className="text-xs text-slate-500">
              Amount
            </div>
            <div
              className={
                isIncome
                  ? "text-2xl font-bold text-emerald-600"
                  : "text-2xl font-bold text-red-500"
              }
            >
              ₹ {tx.amount}
            </div>
          </div>

          <div className="p-4 rounded border border-slate-200">
            <div className="text-xs text-slate-500">
              Type
            </div>
            <div className="mt-1 font-medium">{tx.type}</div>
          </div>

          <div className="p-4 rounded border border-slate-200">
            <div className="text-xs text-slate-500">
              Category
            </div>
            <div className="mt-1 font-medium">{tx.category}</div>
          </div>

          <div className="col-span-2 mt-2">
            <div className="text-xs text-slate-500">
              Description
            </div>
            <div className="mt-1 text-sm">
              {tx.description || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
