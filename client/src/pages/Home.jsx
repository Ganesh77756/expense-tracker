import { useState } from "react";
import heroImg from "../assets/hero.png";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="relative bg-gray-50 min-h-screen">

      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to <span className="text-purple-600">FinSight Tracker</span>
          </h1>

          <p className="text-gray-600 mt-4">
            Track your expenses, manage your income, and stay in control of your
            finances with a simple and modern interface.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setShowLogin(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Get Started
            </button>
          </div>
        </div>

        <div>
          <img src={heroImg} alt="Finance Illustration" className="w-full rounded-xl" />
        </div>
      </section>

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
    </div>
  );
}
