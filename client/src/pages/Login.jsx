import React, { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login({ setShowLogin, setShowSignup }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({ email: "", password: "" });
  }, []);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);
      localStorage.setItem("fin_token", res.data.token);
      localStorage.setItem("fin_user", JSON.stringify(res.data));
      window.dispatchEvent(new Event("auth-change"));
      toast.success("Logged in successfully");
      setForm({ email: "", password: "" });
      setShowLogin(false);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow relative">

        <button
          onClick={() => setShowLogin(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="mb-6">
          <div className="text-sm text-emerald-500 font-semibold tracking-wide">
            FinSight
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Welcome to FinSight
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to track and manage your finances.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <div className="text-sm mb-1 text-slate-600">Email</div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="you@gmail.com"
            />
          </div>

          <div>
            <div className="text-sm mb-1 text-slate-600">Password</div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="At least 8 characters"
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => {
                setShowLogin(false);
                navigate("/forgot-password");
              }}
              className="text-xs text-purple-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          New here?{" "}
          <button
            onClick={() => {
              setShowLogin(false);
              setShowSignup(true);
            }}
            className="text-emerald-500 hover:underline"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}
