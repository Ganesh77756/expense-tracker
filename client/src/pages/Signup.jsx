import React, { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Signup({ setShowSignup, setShowLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({ name: "", email: "", password: "" });
  }, []);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/auth/signup", form);

      toast.success("Account created successfully");

      setForm({ name: "", email: "", password: "" });

      setShowSignup(false);
      setShowLogin(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow relative">

        <button
          onClick={() => setShowSignup(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="mb-6">
          <div className="text-sm text-emerald-500 font-semibold tracking-wide">
            FinSight
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Create account
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Start tracking your income and expenses in minutes.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <div className="text-sm mb-1 text-slate-600">Full Name</div>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Kavya"
            />
          </div>

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

          <button
            disabled={loading}
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <button
            onClick={() => {
              setShowSignup(false);
              setShowLogin(true);
            }}
            className="text-emerald-500 hover:underline"
          >
            Sign in
          </button>
        </div>

      </div>
    </div>
  );
}
