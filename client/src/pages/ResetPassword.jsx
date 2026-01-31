import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!password || !confirm) {
      toast.error("Please fill both fields");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(`/auth/reset/${token}`, { password });
      toast.success(res.data.message || "Password reset successful");
      setPassword("");
      setConfirm("");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Reset Password</h1>
        <p className="text-sm text-slate-500 mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <div className="text-sm mb-1 text-slate-600">New Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="New password"
            />
          </div>

          <div>
            <div className="text-sm mb-1 text-slate-600">Confirm Password</div>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirm password"
            />
          </div>

          <button
            disabled={loading}
            className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
