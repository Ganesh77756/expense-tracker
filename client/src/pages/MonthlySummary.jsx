import React, { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import BackButton from "../components/BackButton";

export default function MonthlySummary() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  const fetchMonthlyData = async () => {
    try {
      const res = await api.get("/transactions/summary/monthly");
      const formatted = res.data.map((item) => ({
        month: `${item.month}/${item.year}`,
        income: item.totalIncome,
        expense: item.totalExpense
      }));
      setData(formatted);
    } catch {
      toast.error("Failed to load monthly summary");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto relative">
      <h1 className="text-2xl font-semibold">Monthly Summary</h1>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#34D399" />
              <Bar dataKey="expense" fill="#F87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3">Month</th>
              <th className="p-3">Income</th>
              <th className="p-3">Expense</th>
              <th className="p-3">Balance</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-100">
                <td className="p-3">{row.month}</td>
                <td className="p-3 text-emerald-600 font-medium">
                  ₹ {row.income}
                </td>
                <td className="p-3 text-red-500 font-medium">
                  ₹ {row.expense}
                </td>
                <td className="p-3 font-semibold">
                  ₹ {row.income - row.expense}
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <BackButton />
    </div>
  );
}
