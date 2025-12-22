# ChatHub 💬

A modern real-time chat application with group chat and private messaging.

## 🚀 Live Links

- **Frontend**: [Chat Application](https://chat-application-frontend-pi-vert.vercel.app)
- **Backend**: [Server](https://chat-application-backend-ru9x.onrender.com)

## Features

- 🔐 JWT Authentication
- 💬 Real-time Group & Private Messaging
- 👥 User List for Private Chats
- 📨 Message Persistence
- 🎨 Modern Responsive UI

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Socket.IO, JWT  
**Frontend:** React 19, Vite, Socket.IO Client, Tailwind CSS

## Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. **Clone and Install**

```bash
# Backend
cd chat-app-backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm start

# Frontend (in new terminal)
cd chat-app-frontend
npm install
npm run dev
```

2. **Environment Variables**

Backend `.env`:

```env
MONGO_URI=mongodb://localhost:27017/chatdb
JWT_SECRET=your_secret_key_here
PORT=5000
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000
```

3. **Access**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Usage

1. **Register** a new account
2. **Login** with your credentials
3. **Group Chat** - Click "# Group Chat" in sidebar
4. **Private Chat** - Click any username to start a private conversation
5. **Logout** - Click the logout button

## Project Structure

```
chat-app/
├── chat-app-backend/       # Node.js + Express + Socket.IO
│   ├── models/             # MongoDB schemas (User, Message)
│   ├── routes/             # API routes (auth, chat)
│   ├── middleware/         # JWT authentication
│   └── index.js            # Server entry point
└── chat-app-frontend/      # React + Vite
    ├── src/components/     # UI components
    ├── src/api/            # API client
    └── src/App.jsx         # Main app component
```

## API Endpoints

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register user     |
| POST   | `/api/auth/login`    | Login & get token |
| GET    | `/api/auth/users`    | Get all users     |
| GET    | `/api/chat/messages` | Fetch messages    |

## License

MIT
