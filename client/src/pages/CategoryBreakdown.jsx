import React, { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";
import BackButton from "../components/BackButton";

export default function CategoryBreakdown() {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState("all");
  const [year, setYear] = useState(new Date().getFullYear());

  const COLORS = ["#10b981", "#f97316", "#6366f1", "#f43f5e", "#06b6d4", "#a855f7"];

  useEffect(() => {
    fetchCategoryData();
  }, [month, year]);

  const fetchCategoryData = async () => {
    try {
      let url = "/transactions/summary/category";

      if (month !== "all") {
        const numericMonth = Number(month);
        url = `/transactions/summary/category/monthly?month=${numericMonth}&year=${year}`;
      }

      const res = await api.get(url);

      const mapped = res.data.map((c) => ({
        name: c._id,
        value: c.totalAmount,
        type: c.type
      }));

      setData(mapped);
    } catch {
      toast.error("Failed to load category breakdown");
    }
  };

  const months = [
    { n: 1, name: "January" },
    { n: 2, name: "February" },
    { n: 3, name: "March" },
    { n: 4, name: "April" },
    { n: 5, name: "May" },
    { n: 6, name: "June" },
    { n: 7, name: "July" },
    { n: 8, name: "August" },
    { n: 9, name: "September" },
    { n: 10, name: "October" },
    { n: 11, name: "November" },
    { n: 12, name: "December" }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      <h1 className="text-2xl font-semibold">Category Breakdown</h1>

      <div className="flex gap-4 mt-6 mb-4">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2"
        >
          <option value="all">All Months</option>
          {months.map((m) => (
            <option key={m.n} value={m.n}>
              {m.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 w-28"
          placeholder="Year"
        />
      </div>

      <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {data.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border divide-y">
        {data.map((item, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <div className="font-medium">{item.name}</div>
            </div>
            <div className="font-semibold">₹ {item.value}</div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="p-4 text-center text-sm text-slate-500">
            No data available
          </div>
        )}
      </div>

      <BackButton />
    </div>
  );
}
