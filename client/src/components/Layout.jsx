import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import Chatbot from "./Chatbot";


import Login from "../pages/Login";
import Signup from "../pages/Signup";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("fin_token"));
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    function check() {
      setToken(localStorage.getItem("fin_token"));
    }
    window.addEventListener("storage", check);
    window.addEventListener("auth-change", check);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("auth-change", check);
    };
  }, []);

  const hideSideUI =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex relative min-h-screen bg-gray-100 text-slate-900">
      {!hideSideUI && token && (
        <Sidebar
          setShowLogin={setShowLogin}
          setShowSignup={setShowSignup}
        />
      )}

      <div className={token && !hideSideUI ? "flex-1 ml-60" : "flex-1"}>
        <Navbar
          setShowLogin={setShowLogin}
          setShowSignup={setShowSignup}
        />

        <div className="p-6">
          <Outlet />
        </div>

        {!hideSideUI && (
          <Footer
            setShowLogin={setShowLogin}
            setShowSignup={setShowSignup}
          />
        )}
      </div>

      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          setShowSignup={setShowSignup}
        />
      )}

      {showSignup && (
        <Signup
          setShowSignup={setShowSignup}
          setShowLogin={setShowLogin}
        />
      )}
      {!hideSideUI && <Chatbot />}

    </div>
  );
}
