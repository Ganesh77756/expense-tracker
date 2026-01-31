import { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import AddLoanModal from "../components/loan/AddLoanModal";
import PayEMIModal from "../components/loan/PayEMIModal";
import LoanItem from "../components/loan/LoanItem";
import EMIHistoryModal from "../components/loan/EMIHistoryModal";
import EMICalendarModal from "../components/loan/EMICalendarModal";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await api.get("/loans");
      setLoans(res.data);
    } catch {
      toast.error("Failed to load loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const totalPrincipal = loans.reduce((sum, l) => sum + l.principal, 0);
  const totalRemaining = loans.reduce((sum, l) => sum + l.remainingAmount, 0);
  const totalMonthlyEMI = loans.reduce(
    (sum, l) => sum + (l.status === "active" ? l.monthlyEMI : 0),
    0
  );

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Loans & EMI Tracker</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          + Add Loan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="text-xs text-slate-500">Total Loan Principal</div>
          <div className="text-xl font-semibold mt-1">₹{totalPrincipal}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-xs text-slate-500">Total Remaining</div>
          <div className="text-xl font-semibold mt-1 text-red-600">
            ₹{totalRemaining}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-xs text-slate-500">Monthly EMI (Active)</div>
          <div className="text-xl font-semibold mt-1 text-emerald-600">
            ₹{totalMonthlyEMI}
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : loans.length === 0 ? (
        <p className="text-slate-500">No loans added yet.</p>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <LoanItem
              key={loan._id}
              loan={loan}
              onPay={(l) => {
                setSelectedLoan(l);
                setShowPay(true);
              }}
              onHistory={(l) => {
                setSelectedLoan(l);
                setShowHistory(true);
              }}
              onCalendar={(l) => {
                setSelectedLoan(l);
                setShowCalendar(true);
              }}
              onRefresh={fetchLoans}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <AddLoanModal
          onClose={() => setShowAdd(false)}
          onRefresh={fetchLoans}
        />
      )}

      {showPay && selectedLoan && (
        <PayEMIModal
          loan={selectedLoan}
          onClose={() => setShowPay(false)}
          onRefresh={fetchLoans}
        />
      )}

      {showHistory && selectedLoan && (
        <EMIHistoryModal
          loan={selectedLoan}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showCalendar && selectedLoan && (
        <EMICalendarModal
          loan={selectedLoan}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
}
