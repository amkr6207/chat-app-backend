import React, { useState } from "react";
import { registerUser } from "../api/auth";

export default function Register({ onToggleMode }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerUser(form);
      setMessage("✅ Registration successful! You can now login.");
      setForm({ username: "", email: "", password: "" });
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setMessage(
        "❌ " + (err.response?.data?.message || "Registration failed")
      );
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-gradient-to-br from-teal-900 via-cyan-900 to-slate-900 rounded-2xl shadow-2xl border border-teal-500/30 backdrop-blur-lg">
      <div className="mb-6">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-300 text-sm">
          Join our chat community
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg mb-6 text-center font-semibold text-sm transition-all duration-300 ${message.includes("✅")
              ? "bg-green-500/20 text-green-300 border border-green-500/50"
              : "bg-red-500/20 text-red-300 border border-red-500/50"
            }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-800/50 text-white placeholder-gray-400 border border-teal-500/50 rounded-lg focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition backdrop-blur-sm"
          />
          <span className="absolute right-3 top-3 text-teal-400">👤</span>
        </div>

        <div className="relative">
          <input
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            type="email"
            required
            className="w-full px-4 py-3 bg-slate-800/50 text-white placeholder-gray-400 border border-teal-500/50 rounded-lg focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition backdrop-blur-sm"
          />
          <span className="absolute right-3 top-3 text-teal-400">📧</span>
        </div>

        <div className="relative">
          <input
            name="password"
            placeholder="Password (6+ chars)"
            value={form.password}
            onChange={handleChange}
            type="password"
            required
            minLength="6"
            className="w-full px-4 py-3 bg-slate-800/50 text-white placeholder-gray-400 border border-teal-500/50 rounded-lg focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition backdrop-blur-sm"
          />
          <span className="absolute right-3 top-3 text-teal-400">🔐</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-gray-400 text-sm mt-6">
        Already have an account?{" "}
        <span
          onClick={onToggleMode}
          className="text-teal-400 font-semibold cursor-pointer hover:text-teal-300"
        >
          Login here
        </span>
      </p>
    </div>
  );
}
