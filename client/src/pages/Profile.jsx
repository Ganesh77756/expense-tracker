import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("fin_token");

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        toast.error("Session expired, please login again");
        navigate("/login");
      });
  }, [navigate, token]);

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );

  // First letter avatar
  const initial = user.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="max-w-2xl mx-auto mt-14 bg-white p-10 rounded-2xl shadow-lg border border-slate-200">
      
      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-purple-600 text-white text-4xl font-bold flex items-center justify-center shadow-md">
          {initial}
        </div>
      </div>

      <h2 className="text-3xl font-semibold text-center mb-8">
        My Profile
      </h2>

      <div className="space-y-5 text-lg">
        <p>
          <span className="font-semibold text-slate-700">Name:</span>{" "}
          <span className="text-slate-900">{user.name}</span>
        </p>
        <p>
          <span className="font-semibold text-slate-700">Email:</span>{" "}
          <span className="text-slate-900">{user.email}</span>
        </p>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("fin_token");
          localStorage.removeItem("fin_user");
          toast.success("Logged out successfully");
          navigate("/");
        }}
        className="mt-10 w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
      >
        Logout
      </button>
    </div>
  );
}
