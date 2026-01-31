import { Link } from "react-router-dom";
import logoImg from "../assets/logo.svg";

export default function Footer({ setShowLogin }) {
  const token = localStorage.getItem("fin_token");

  const protectedNav = (path) => {
    if (!token) {
      setShowLogin(true);
      return;
    }
    window.location.href = path;
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        <div>
          <div className="flex items-center gap-2 mb-4">
            <img
              src={logoImg}
              alt="FinSight Logo"
              className="h-15 w-260 object-contain"
            />
          </div>

          <p className="text-gray-400">
            Track your finances, manage your expenses, and stay in control with ease.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Useful Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="hover:text-purple-400">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-purple-400">
                Contact
              </Link>
            </li>

            {!token && (
              <li
                onClick={() => setShowLogin(true)}
                className="cursor-pointer hover:text-purple-400"
              >
                Login
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Product</h3>
          <ul className="space-y-2">

            <li
              onClick={() => protectedNav("/dashboard")}
              className="cursor-pointer hover:text-purple-400"
            >
              Dashboard
            </li>

            <li
              onClick={() => protectedNav("/transactions")}
              className="cursor-pointer hover:text-purple-400"
            >
              Transactions
            </li>

            <li
              onClick={() => protectedNav("/monthly-summary")}
              className="cursor-pointer hover:text-purple-400"
            >
              Monthly Summary
            </li>

            <li
              onClick={() => protectedNav("/categories")}
              className="cursor-pointer hover:text-purple-400"
            >
              Categories
            </li>

          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <p className="text-gray-400">📧 support@finsight.com</p>
          <p className="text-gray-400 mt-2">📞 +91 9284955948</p>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-4">
        <p className="text-gray-500">
          © {new Date().getFullYear()} FinSight Tracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
