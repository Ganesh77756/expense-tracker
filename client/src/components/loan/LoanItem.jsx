import api from "../../utils/api";
import { FiCreditCard } from "react-icons/fi";

export default function LoanItem({
  loan,
  onPay,
  onHistory,
  onCalendar,
  onRefresh
}) {
  const totalPayable = loan.monthlyEMI * loan.tenureMonths;
  const paidAmount = totalPayable - loan.remainingAmount;
  const progress =
    totalPayable > 0 ? Math.round((paidAmount / totalPayable) * 100) : 0;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const isActive = loan.status === "active" && loan.remainingAmount > 0;

  const getNextEMIDate = () => {
    if (!isActive || !loan.startDate) return null;
    const start = new Date(loan.startDate);
    if (isNaN(start)) return null;
    const emiDay = start.getDate() + 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let year = today.getFullYear();
    let month = today.getMonth();
    let next = new Date(year, month, emiDay);
    next.setHours(0, 0, 0, 0);
    if (next < today) {
      next = new Date(year, month + 1, emiDay);
      next.setHours(0, 0, 0, 0);
    }
    return next;
  };

  const nextDueDate = getNextEMIDate();
  const today = new Date();
  const daysToDue =
    nextDueDate != null
      ? Math.ceil((nextDueDate - today) / (1000 * 60 * 60 * 24))
      : null;

  return (
    <div className="border rounded-xl shadow-sm p-5 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl">
          <FiCreditCard />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{loan.lenderName}</h3>
          <p className="text-sm text-slate-600">
            Principal: <span className="font-medium">₹{loan.principal}</span>
          </p>
          <p className="text-sm text-slate-600">
            Monthly EMI: <span className="font-medium">₹{loan.monthlyEMI}</span>
          </p>
          <p className="text-sm text-slate-600">
            Remaining:{" "}
            <span className="font-bold text-red-600">₹{loan.remainingAmount}</span>
          </p>
          <p className="text-sm mt-1">
            Status:{" "}
            <span
              className={`px-2 py-1 rounded text-xs ${
                loan.status === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {loan.status}
            </span>
          </p>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Progress</span>
              <span>{clampedProgress}%</span>
            </div>
            <div className="w-40 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
              <div
                className="h-2 bg-emerald-500"
                style={{ width: `${clampedProgress}%` }}
              />
            </div>
          </div>
          {nextDueDate && (
            <p className="text-xs text-slate-500 mt-2">
              Next EMI: {nextDueDate.toLocaleDateString()}
              {daysToDue != null && daysToDue >= 0 && daysToDue <= 7 && (
                <span className="ml-2 text-amber-600 font-medium">Due soon</span>
              )}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-row md:flex-col gap-2 md:items-end">
        {isActive && (
          <button
            onClick={() => onPay(loan)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
          >
            Pay EMI
          </button>
        )}
        <button
          onClick={() => onHistory(loan)}
          className="px-4 py-2 rounded-lg border text-sm"
        >
          History
        </button>
        <button
          onClick={() => onCalendar(loan)}
          className="px-4 py-2 rounded-lg border text-sm"
        >
          Calendar
        </button>
        <button
          onClick={async () => {
            if (!window.confirm("Delete this loan?")) return;
            await api.delete(`/loans/${loan._id}`);
            onRefresh();
          }}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
