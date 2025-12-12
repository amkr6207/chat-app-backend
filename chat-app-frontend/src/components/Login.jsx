import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login({ onLogin, onToggleMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, username } = res.data;
      onLogin(token, username);
    } catch (err) {
      setError("❌ " + (err.response?.data?.message || "Login failed"));
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto p-8 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-2xl shadow-2xl border border-teal-500/30 backdrop-blur-lg"
    >
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-300 text-sm">
          Sign in to your account
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg mb-6 text-center font-semibold text-sm bg-red-500/20 text-red-300 border border-red-500/50 transition-all duration-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-800/50 text-white placeholder-gray-400 border border-teal-500/50 rounded-lg focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition backdrop-blur-sm"
          />
          <span className="absolute right-3 top-3 text-teal-400">📧</span>
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-800/50 text-white placeholder-gray-400 border border-teal-500/50 rounded-lg focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition backdrop-blur-sm"
          />
          <span className="absolute right-3 top-3 text-teal-400">🔐</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 mt-6 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-center text-gray-400 text-sm mt-6">
        Don't have an account?{" "}
        <span
          onClick={onToggleMode}
          className="text-teal-400 font-semibold cursor-pointer hover:text-teal-300"
        >
          Register here
        </span>
      </p>

      <div className="mt-8 pt-6 border-t border-teal-500/20">
        <p className="text-center text-gray-500 text-xs">
          🔒 Your data is secure with end-to-end encryption
        </p>
      </div>
    </form>
  );
}
