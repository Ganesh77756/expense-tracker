import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import logoImg from "../assets/logo.svg";

export default function Navbar({ setShowLogin, setShowSignup }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("fin_token"));
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // 👇 keep user + initial in state so UI updates
  const [initial, setInitial] = useState("U");

  const updateUserState = () => {
    const user = JSON.parse(localStorage.getItem("fin_user") || "{}");
    const letter = (user?.name?.[0] || user?.email?.[0] || "U").toUpperCase();
    setInitial(letter);
    setToken(localStorage.getItem("fin_token"));
  };

  useEffect(() => {
    updateUserState();

    // 👇 listen for storage and custom auth events
    const handle = () => updateUserState();

    window.addEventListener("storage", handle);
    window.addEventListener("auth-change", handle);

    return () => {
      window.removeEventListener("storage", handle);
      window.removeEventListener("auth-change", handle);
    };
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">

      <Link
        to="/"
        onClick={() => setOpen(false)}
        className="flex items-center gap-2"
      >
        <img src={logoImg} alt="FinSight Logo" className="h-10 object-contain" />
      </Link>

      <div className="hidden md:flex items-center gap-6 text-slate-700 font-medium">
        <Link to="/" className="hover:text-purple-600">Home</Link>
        <Link to="/about" className="hover:text-purple-600">About</Link>
        <Link to="/contact" className="hover:text-purple-600">Contact</Link>

        <button
          onClick={() => {
            if (!token) {
              toast.error("Login required");
              setShowLogin(true);
            } else {
              navigate("/dashboard");
            }
          }}
          className="hover:text-purple-600"
        >
          Products
        </button>
      </div>

      <div className="flex items-center gap-4">
        {!token ? (
          <>
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg"
            >
              Login
            </button>

            <button
              onClick={() => setShowSignup(true)}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Signup
            </button>
          </>
        ) : (
          <div className="relative" ref={menuRef}>

            {/* 👇 AVATAR updates instantly */}
            <div
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center cursor-pointer text-lg font-bold shadow"
            >
              {initial}
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border">
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem("fin_token");
                    localStorage.removeItem("fin_user");
                    window.dispatchEvent(new Event("auth-change"));
                    setOpen(false);
                    toast.success("Logged out");
                    navigate("/");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </nav>
  );
}
