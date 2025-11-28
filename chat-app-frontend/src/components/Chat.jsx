import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axiosInstance from "../api/auth";
import { fetchUsers } from "../api/users";
import { jwtDecode } from "jwt-decode";

export default function Chat({ token, username, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // user object or null for group chat
  const socketRef = useRef(null);
  const messagesRef = useRef(null);
  // Store logged-in user's MongoDB _id
  const [userId, setUserId] = useState("");

  // Decode JWT to get userId on mount
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (e) {
        setUserId("");
      }
    }
  }, [token]);

  // Fetch user list on mount
  useEffect(() => {
    let mounted = true;
    async function getUsers() {
      try {
        const res = await fetchUsers(token);
        if (!mounted) return;
        setUsers(res.data.filter((u) => u.username !== username));
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    }
    getUsers();
    return () => {
      mounted = false;
    };
  }, [token, username]);

  // Fetch messages for selected user (private) or group
  useEffect(() => {
    let mounted = true;
    async function fetchMessages() {
      try {
        const params = { limit: 100 };
        if (selectedUser) params.userId = selectedUser._id;
        const res = await axiosInstance.get("/chat/messages", {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
        if (!mounted) return;
        setMessages(res.data.messages || []);
        setTimeout(() => scrollToBottom(), 50);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    }
    fetchMessages();
    return () => {
      mounted = false;
    };
  }, [token, selectedUser]);

  // Socket connection with token auth
  useEffect(() => {
    if (!token || !userId) return;
    const socket = io("http://localhost:5000", {
      auth: { token },
    });
    socketRef.current = socket;
    socket.on("connect_error", (err) => {
      console.error("Socket connect error", err.message);
    });
    socket.on("receive_message", (message) => {
      // Only add message if it's for this chat (group or selected user)
      if (
        (!selectedUser && !message.recipient) ||
        (selectedUser &&
          ((message.sender === selectedUser._id &&
            message.recipient === userId) ||
            (message.sender === userId &&
              message.recipient === selectedUser._id)))
      ) {
        setMessages((prev) => [...prev, message]);
        setTimeout(() => scrollToBottom(), 20);
      }
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, userId, selectedUser]);

  const scrollToBottom = () => {
    try {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    } catch (e) {
      // ignore
    }
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;
    const payload = {
      text: input.trim(),
      recipientId: selectedUser ? selectedUser._id : undefined,
      recipientName: selectedUser ? selectedUser.username : undefined,
    };
    try {
      socketRef.current && socketRef.current.emit("send_message", payload);
      setInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="flex flex-row w-full max-w-5xl h-screen md:h-[92vh] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-teal-500/20 backdrop-blur-lg">
      {/* User list sidebar */}
      <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-teal-500/20 flex flex-col">
        <div className="p-6 border-b border-teal-500/20 bg-gradient-to-r from-teal-600/10 to-cyan-600/10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">👥</span>
            <div className="font-bold text-white text-lg">Conversations</div>
          </div>
          <button
            className={`w-full text-left px-3 py-2 rounded-lg mb-2 font-semibold transition-all duration-200 flex items-center gap-2 ${
              !selectedUser
                ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg"
                : "hover:bg-slate-700/50 text-gray-300"
            }`}
            onClick={() => setSelectedUser(null)}
          >
            <span className="text-lg">#</span> Group Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-6 text-sm">
              No users online
            </p>
          ) : (
            users.map((user) => (
              <button
                key={user._id}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold truncate ${
                  selectedUser && selectedUser._id === user._id
                    ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg"
                    : "hover:bg-slate-700/50 text-gray-300 hover:text-white"
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <span className="text-lg">💬</span>
                <span className="truncate">@{user.username}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-col flex-1">
        {/* Header with logout */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border-b border-teal-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedUser ? "💬" : "🌐"}</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              {selectedUser ? `@${selectedUser.username}` : "Group Chat"}
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="px-5 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <span>🚪</span> Logout
          </button>
        </div>

        {/* Messages container */}
        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-slate-900/50 scrollbar-thin scrollbar-thumb-teal-600/50 scrollbar-track-slate-800"
        >
          {messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 text-center">
                {selectedUser
                  ? `No messages yet. Start chatting with @${selectedUser.username}!`
                  : "No messages yet. Be the first to say hello! 👋"}
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.senderName === username;
              return (
                <div
                  key={msg._id || Math.random()}
                  className={`flex ${
                    isOwn ? "justify-end" : "justify-start"
                  } animate-fadeIn`}
                >
                  <div
                    className={`px-5 py-3 rounded-2xl max-w-xs lg:max-w-md break-words shadow-lg transition-all duration-200 ${
                      isOwn
                        ? "bg-gradient-to-br from-teal-600 to-cyan-600 text-white rounded-br-none"
                        : "bg-gradient-to-br from-slate-700 to-slate-800 text-gray-100 rounded-bl-none border border-slate-600"
                    }`}
                  >
                    {!isOwn && (
                      <p className="font-bold text-xs mb-1 opacity-80">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="text-sm md:text-base">{msg.text}</p>
                    <p
                      className={`text-xs opacity-60 mt-2 text-right ${
                        isOwn ? "" : ""
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input area */}
        <div className="flex gap-3 px-6 py-4 bg-gradient-to-t from-slate-900 to-slate-900/50 border-t border-teal-500/20">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message... (press Enter to send)"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-5 py-3 bg-slate-800/50 text-white placeholder-gray-400 rounded-full border border-teal-500/30 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition backdrop-blur-sm"
          />
          <button
            onClick={sendMessage}
            className="px-7 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <span>✈️</span> Send
          </button>
        </div>
      </div>
    </div>
  );
}
