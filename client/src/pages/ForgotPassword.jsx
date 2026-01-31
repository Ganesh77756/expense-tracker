import { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      const res = await api.post("/auth/forgot", { email });
      toast.success(res.data.message || "If this email exists, a reset link has been sent");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Forgot Password</h1>
        <p className="text-sm text-slate-500 mb-6">
          Enter your registered email. If it exists, we will send a reset link.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <div className="text-sm mb-1 text-slate-600">Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@email.com"
            />
          </div>

          <button
            disabled={loading}
            className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
