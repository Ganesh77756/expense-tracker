import { useState } from "react";
import { calculateEMI } from "../utils/loanUtils";

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [emi, setEmi] = useState(null);

  const handleCalculate = () => {
    if (!principal || !rate || !months) return;
    const result = calculateEMI(Number(principal), Number(rate), Number(months));
    setEmi(Math.round(result));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Loan EMI Calculator</h2>

      <input
        type="number"
        placeholder="Loan Amount (₹)"
        value={principal}
        onChange={(e) => setPrincipal(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      <input
        type="number"
        placeholder="Interest Rate (%)"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      <input
        type="number"
        placeholder="Loan Tenure (months)"
        value={months}
        onChange={(e) => setMonths(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      <button
        onClick={handleCalculate}
        className="bg-purple-600 text-white w-full py-2 rounded-lg hover:bg-purple-700"
      >
        Calculate EMI
      </button>

      {emi !== null && (
        <div className="mt-5 text-center text-lg font-bold text-emerald-600">
          Monthly EMI: ₹ {emi}
        </div>
      )}
    </div>
  );
}
