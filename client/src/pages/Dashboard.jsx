import React, { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import BackButton from "../components/BackButton";

export default function Dashboard() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [recent, setRecent] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/transactions/dashboard");
      setSummary(res.data.summary);
      setRecent(res.data.recent || []);
      const mapped = (res.data.recent || [])
        .slice()
        .reverse()
        .map((t, idx) => ({
          label: t.title,
          value: t.type === "income" ? t.amount : -t.amount,
          idx
        }));
      setChartData(mapped);
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm text-emerald-500 font-semibold">Overview</div>
          <h1 className="text-2xl font-semibold mt-1">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quick snapshot of your income, expenses and recent activity.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/transactions"
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm"
          >
            View All Transactions
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Total Income</div>
          <div className="mt-2 text-2xl font-semibold text-emerald-600">
            ₹ {summary.income}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Total Expense</div>
          <div className="mt-2 text-2xl font-semibold text-red-500">
            ₹ {summary.expense}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Balance</div>
          <div className="mt-2 text-2xl font-semibold">
            ₹ {summary.balance}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Recent Flow</div>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="label" hide />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#34D399"
                  fill="#34D39933"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Recent Transactions</div>
            <Link
              to="/transactions"
              className="text-xs text-emerald-500"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recent.length === 0 && (
              <div className="text-sm text-slate-500">
                No recent transactions
              </div>
            )}
            {recent.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs text-slate-500">
                    {t.category} •{" "}
                    {new Date(t.date).toLocaleDateString()}
                  </div>
                </div>
                <div
                  className={
                    t.type === "income"
                      ? "text-emerald-600 font-semibold"
                      : "text-red-500 font-semibold"
                  }
                >
                  {t.type === "income" ? "+" : "-"}₹ {t.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BackButton />
    </div>
  );
}
