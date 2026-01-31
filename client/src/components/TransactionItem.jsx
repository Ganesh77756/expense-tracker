import React from "react";
import { FiArrowUpCircle, FiArrowDownCircle } from "react-icons/fi";

export default function TransactionItem({ tx, onView, onEdit, onDelete }) {
  return (
    <div
      className="
        grid grid-cols-12 items-center gap-y-3 md:gap-y-0 md:gap-x-4
        p-4 border-b border-slate-200
        hover:bg-slate-50 transition
      "
    > 
      <div className="col-span-12 md:col-span-4 flex items-center gap-2">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center text-xl ${
            tx.type === "income"
              ? "bg-emerald-100 text-emerald-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {tx.type === "income" ? <FiArrowUpCircle /> : <FiArrowDownCircle />}
        </div>

        <div className="min-w-0">
          <div className="font-semibold truncate">{tx.title}</div>
          <div className="text-xs text-slate-500 truncate">
            {tx.description}
          </div>
        </div>
      </div>

     
      <div className="col-span-6 md:col-span-2 text-slate-700 capitalize">
        {tx.category}
      </div>

      
      <div className="col-span-6 md:col-span-1 text-slate-700 text-sm">
        {new Date(tx.date).toLocaleDateString()}
      </div>

      
      <div
        className={`
          col-span-6 md:col-span-2 text-right font-semibold
          whitespace-nowrap overflow-hidden text-ellipsis
          ${tx.type === "income" ? "text-emerald-600" : "text-red-600"}
        `}
      >
        ₹ {tx.amount}
      </div>

      
      <div className="col-span-12 md:col-span-2 flex justify-end gap-2">
        <button
          onClick={onView}
          className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded"
        >
          View
        </button>
        <button
          onClick={onEdit}
          className="bg-yellow-100 text-yellow-700 px-3 py-1 text-xs rounded"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-100 text-red-700 px-3 py-1 text-xs rounded"
        >
          Del
        </button>
      </div>
    </div>
  );
}
