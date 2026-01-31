import { useEffect, useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function EMICalendarModal({ loan, onClose }) {
  const [history, setHistory] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/loans/${loan._id}/payments`);
      setHistory(res.data || null);
    } catch {
      toast.error("Failed to load EMI calendar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [loan._id]);

  const payments = history?.payments ?? [];

  const changeMonth = (delta) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  const { byDate: paymentMap, byMonth: paymentMonthMap } = (() => {
    const byDate = new Map();
    const byMonth = new Map();
    payments.forEach((p) => {
      const d = new Date(p.date);
      if (isNaN(d)) return;
      const dateKey = d.toISOString().split("T")[0];
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
      const prev = byDate.get(dateKey) || 0;
      byDate.set(dateKey, prev + p.amount);
      if (!byMonth.has(monthKey)) byMonth.set(monthKey, true);
    });
    return { byDate, byMonth };
  })();

  const buildDueDates = () => {
    const dates = [];
    if (!loan.startDate || !loan.tenureMonths) return dates;
    const start = new Date(loan.startDate);
    if (isNaN(start)) return dates;
    const fallbackDay = start.getDate() + 1;
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    for (let i = 0; i < loan.tenureMonths; i++) {
      const d = new Date(startYear, startMonth + i, fallbackDay);
      d.setUTCHours(0, 0, 0, 0);
      dates.push(d);
    }
    return dates;
  };

  const allDueDates = buildDueDates();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isClosed = loan.status === "closed" || loan.remainingAmount <= 0;
  const dueStatusMap = new Map();
  const start = loan.startDate ? new Date(loan.startDate) : null;
  let end = null;

  if (start && !isNaN(start) && loan.tenureMonths) {
    const e = new Date(start);
    e.setMonth(e.getMonth() + loan.tenureMonths - 1);
    end = e;
  }

  paymentMap.forEach((amount, dateKey) => {
    const d = new Date(dateKey);
    if (start && end && (d < start || d > end)) return;
    if (isClosed && d > today) return;
    dueStatusMap.set(dateKey, "paid");
  });

  let upcomingMarked = false;
  const sortedDue = [...allDueDates].sort((a, b) => a - b);

  sortedDue.forEach((d) => {
    if (start && end && (d < start || d > end)) return;
    if (isClosed && d > today) return;

    const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
    const hasPayment = paymentMonthMap.has(monthKey);
    const dateKey = d.toISOString().split("T")[0];

    if (hasPayment) {
      if (!dueStatusMap.has(dateKey)) {
        const paid = payments.find((p) => {
          const pd = new Date(p.date);
          return (
            pd.getFullYear() === d.getFullYear() &&
            pd.getMonth() === d.getMonth()
          );
        });
        if (paid) {
          const paidKey = new Date(paid.date).toISOString().split("T")[0];
          dueStatusMap.set(paidKey, "paid");
        }
      }
      return;
    }

    if (d < today) {
      if (!dueStatusMap.has(dateKey)) dueStatusMap.set(dateKey, "missed");
    } else if (!upcomingMarked && !isClosed) {
      dueStatusMap.set(dateKey, "upcoming");
      upcomingMarked = true;
    } else if (!isClosed) {
      if (!dueStatusMap.has(dateKey)) dueStatusMap.set(dateKey, "scheduled");
    }
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month, 1).toLocaleString("default", {
    month: "long"
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  const monthDueDates = allDueDates.filter(
    (d) => d.getMonth() === month && d.getFullYear() === year
  );
  const monthExpected = monthDueDates.length;
  const monthPaid = monthDueDates.filter((d) => {
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    return paymentMonthMap.has(key);
  }).length;
  const monthMissed = monthDueDates.filter((d) => {
    const key = d.toISOString().split("T")[0];
    return dueStatusMap.get(key) === "missed";
  }).length;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-lg relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-slate-500 hover:text-slate-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-1">EMI Calendar</h2>
        <p className="text-sm text-slate-500 mb-4">{loan.lenderName}</p>

        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => changeMonth(-1)}
            className="px-3 py-1 border rounded-lg bg-slate-50 hover:bg-slate-100 text-sm"
          >
            Prev
          </button>
          <div className="font-medium text-sm">
            {monthName} {year}
          </div>
          <button
            onClick={() => changeMonth(1)}
            className="px-3 py-1 border rounded-lg bg-slate-50 hover:bg-slate-100 text-sm"
          >
            Next
          </button>
        </div>

        <div className="flex gap-4 text-xs text-slate-600 mb-3">
          <span>Expected: {monthExpected}</span>
          <span>Paid: {monthPaid}</span>
          <span className={monthMissed > 0 ? "text-rose-600" : ""}>
            Missed: {monthMissed}
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-7 text-xs text-slate-500 mb-2">
              {weekdayLabels.map((d) => (
                <div key={d} className="text-center py-1 font-medium">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-sm">
              {cells.map((day, idx) => {
                if (day === null) return <div key={idx} />;
                const dateObj = new Date(year, month, day);
                const dateKey = dateObj.toISOString().split("T")[0];
                const status = dueStatusMap.get(dateKey);
                const paidAmount = paymentMap.get(dateKey);

                let className =
                  "h-10 flex items-center justify-center rounded-md border text-xs transition";

                if (status === "paid") {
                  className +=
                    " bg-emerald-300 border-emerald-500 text-emerald-900 font-semibold";
                } else if (status === "missed") {
                  className +=
                    " bg-rose-300 border-rose-600 text-rose-900 font-semibold";
                } else if (status === "upcoming") {
                  className +=
                    " bg-blue-300 border-blue-600 text-blue-900 font-semibold";
                } else if (status === "scheduled") {
                  className +=
                    " bg-slate-300 border-slate-500 text-slate-900 font-medium";
                } else {
                  className +=
                    " bg-slate-100 border-slate-300 text-slate-700";
                }

                let title = "";
                if (status === "paid") {
                  title = `EMI paid: ₹${paidAmount}`;
                } else if (status === "missed") {
                  title = `Missed EMI: ₹${loan.monthlyEMI}`;
                } else if (status === "upcoming") {
                  title = `Upcoming EMI: ₹${loan.monthlyEMI}`;
                } else if (status === "scheduled") {
                  title = `Scheduled EMI: ₹${loan.monthlyEMI}`;
                }

                return (
                  <div key={idx} className={className} title={title}>
                    {day}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-xs text-slate-500 flex flex-wrap gap-4">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-emerald-300 border border-emerald-500" />
                <span>Paid EMI</span>
              </div>
              {!isClosed && (
                <>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-rose-300 border border-rose-600" />
                    <span>Missed EMI</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-blue-300 border border-blue-600" />
                    <span>Upcoming EMI</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-slate-300 border border-slate-500" />
                    <span>Scheduled EMI</span>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
