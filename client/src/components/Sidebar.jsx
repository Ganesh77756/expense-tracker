import { NavLink } from "react-router-dom";
import { FiHome, FiLayers, FiBarChart2, FiList, FiDollarSign } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Sidebar({ setShowLogin }) {
  const token = localStorage.getItem("fin_token");

  if (!token) return null;

  const protectedNav = (path) => {
    if (!token) {
      toast.error("Please login first");
      window.dispatchEvent(
        new CustomEvent("open-login-modal")
      );
      return;
    }
    window.dispatchEvent(
      new CustomEvent("navigate", { detail: path })
    );
  };

  return (
    <div className="w-60 h-screen bg-purple-100 border-r border-purple-200 p-5 fixed left-0 top-0">
      <h1 className="text-2xl font-bold text-purple-700 mb-8">FinSight</h1>

      <nav className="flex flex-col gap-4">

        <NavLink
          to="/dashboard"
          onClick={() => protectedNav("/dashboard")}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 ${
              isActive ? "bg-purple-300 font-semibold text-purple-800" : ""
            }`
          }
        >
          <FiHome /> Dashboard
        </NavLink>

        <NavLink
          to="/transactions"
          onClick={() => protectedNav("/transactions")}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 ${
              isActive ? "bg-purple-300 font-semibold text-purple-800" : ""
            }`
          }
        >
          <FiList /> Transactions
        </NavLink>

        <NavLink
          to="/monthly-summary"
          onClick={() => protectedNav("/monthly-summary")}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 ${
              isActive ? "bg-purple-300 font-semibold text-purple-800" : ""
            }`
          }
        >
          <FiBarChart2 /> Monthly Summary
        </NavLink>

        <NavLink
          to="/categories"
          onClick={() => protectedNav("/categories")}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 ${
              isActive ? "bg-purple-300 font-semibold text-purple-800" : ""
            }`
          }
        >
          <FiLayers /> Categories
        </NavLink>

        <NavLink
          to="/loans"
          onClick={() => protectedNav("/loans")}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 ${
              isActive ? "bg-purple-300 font-semibold text-purple-800" : ""
            }`
          }
        >
          <FiDollarSign /> Loans
        </NavLink>

      </nav>
    </div>
  );
}
