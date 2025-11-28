import React, { useState, useEffect } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Chat from "./components/Chat";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleLogin = (token, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setToken(token);
    setUsername(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    setUsername("");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    const storedUsername = localStorage.getItem("username") || "";
    setToken(storedToken);
    setUsername(storedUsername);
  }, []);

  if (!token) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                💬 ChatHub
              </h1>
              <p className="text-xl md:text-2xl text-gray-300">
                Real-time messaging, instantly connected
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-12">
              <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-lg backdrop-blur-sm">
                <div className="text-3xl mb-2">🚀</div>
                <p className="text-gray-300 text-sm font-semibold">
                  Lightning Fast
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/30 rounded-lg backdrop-blur-sm">
                <div className="text-3xl mb-2">🔐</div>
                <p className="text-gray-300 text-sm font-semibold">
                  Fully Secure
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 rounded-lg backdrop-blur-sm">
                <div className="text-3xl mb-2">👥</div>
                <p className="text-gray-300 text-sm font-semibold">
                  Private & Group
                </p>
              </div>
            </div>
          </div>

          {/* Auth Forms */}
          <div className="flex flex-col items-center gap-8">
            {/* Toggle Buttons */}
            <div className="flex gap-4 backdrop-blur-sm">
              <button
                onClick={() => setIsLoginMode(true)}
                className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
                  isLoginMode
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl"
                    : "bg-slate-800/50 text-gray-300 border border-slate-700 hover:bg-slate-700/50"
                }`}
              >
                🔓 Sign In
              </button>
              <button
                onClick={() => setIsLoginMode(false)}
                className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
                  !isLoginMode
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl"
                    : "bg-slate-800/50 text-gray-300 border border-slate-700 hover:bg-slate-700/50"
                }`}
              >
                ✨ Sign Up
              </button>
            </div>

            {/* Forms Container */}
            <div className="w-full max-w-md">
              {isLoginMode ? <Login onLogin={handleLogin} /> : <Register />}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-gray-500 text-sm">
            <p>Made with ❤️ • Powered by React, Node.js & Socket.IO</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Chat token={token} username={username} onLogout={handleLogout} />
    </div>
  );
}
