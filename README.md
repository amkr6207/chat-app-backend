# Chat Application

A modern, real-time chat app with **group chat** and **private messaging** built with React, Node.js, Express, MongoDB, and Socket.IO.

## Features

- 🔐 User authentication (JWT)
- 💬 Real-time group & private messaging
- � User list for private chats
- 📨 Message persistence
- 🎨 Modern responsive UI (Tailwind CSS)
- 📱 Mobile-friendly

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Socket.IO, JWT, bcryptjs
**Frontend:** React 19, Vite, Socket.IO Client, Axios, Tailwind CSS v3

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)

## Quick Start

### 1. Backend Setup

```bash
cd chat-app-backend
npm install
cp .env.example .env
# Edit .env: add MONGO_URI, JWT_SECRET, PORT
npm run dev
```

### 2. Frontend Setup

```bash
cd chat-app-frontend
npm install
npm run dev
# Open http://localhost:5173
```

### 3. MongoDB

```bash
mongod  # or use MongoDB Atlas (cloud)
```

## Usage

1. **Register** → Enter username, email, password
2. **Login** → Enter email and password
3. **Group Chat** → Click "# Group Chat" in sidebar
4. **Private Chat** → Click a username to chat privately
5. **Logout** → Click logout button

## API Endpoints

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register user     |
| POST   | `/api/auth/login`    | Login & get token |
| GET    | `/api/auth/users`    | Get all users     |
| GET    | `/api/chat/messages` | Fetch messages    |
| POST   | `/api/chat/messages` | Send message      |

**Send Message:**

```json
{
  "text": "Hello!",
  "recipientId": "userId", // omit for group chat
  "recipientName": "username" // omit for group chat
}
```

## Socket Events

**Client → Server:**

```javascript
socket.emit("send_message", {
  text: "Hello",
  recipientId: "userId", // optional (for private)
  recipientName: "username", // optional (for private)
});
```

**Server → Client:**

```javascript
socket.on("receive_message", (message) => {
  // message received
});
```

## Environment Variables

**Backend (.env):**

```
MONGO_URI=mongodb://localhost:27017/chatdb
JWT_SECRET=your_secret_key
PORT=5000
```

**Frontend (.env.local - optional):**

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Project Structure

```
chat-app/
├── chat-app-backend/
│   ├── models/      (User, Message)
│   ├── routes/      (auth, chat)
│   ├── middleware/  (auth)
│   └── index.js     (Socket.IO server)
├── chat-app-frontend/
│   ├── src/components/  (Chat, Login, Register)
│   ├── src/api/         (auth, users)
│   └── src/App.jsx
├── .gitignore
└── README.md
```

## Contributing

1. Fork repo
2. Create branch: `git checkout -b feature/name`
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/name`
5. Open PR
