require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');   // if you have auth
const chatRoutes = require('./routes/chat');   // if you have chat API routes
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// Socket authentication middleware: expect token in socket.handshake.auth.token
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.user = decoded; // { id, username }
      next();
    });
  } catch (err) {
    console.error('Socket auth error', err);
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('New authenticated client connected:', socket.id, socket.user && socket.user.username);

  // When client sends a message, save it server-side and broadcast the saved document
  // Map userId to socket.id for private messaging
  if (!io.userSockets) io.userSockets = {};
  io.userSockets[socket.user.id] = socket.id;

  socket.on('send_message', async (payload) => {
    try {
      console.log('[SOCKET] send_message payload:', payload);
      console.log('[SOCKET] user:', socket.user);
      const text = (payload && payload.text) ? String(payload.text).trim() : '';
      const recipientId = payload && payload.recipientId;
      const recipientName = payload && payload.recipientName;
      if (!text) {
        console.log('[SOCKET] Ignored empty message');
        return;
      }
      if (!socket.user || !socket.user.id || !socket.user.username) {
        console.log('[SOCKET] Invalid user in socket:', socket.user);
        return;
      }
      // Save message
      const msg = new Message({
        sender: socket.user.id,
        senderName: socket.user.username || 'Unknown',
        recipient: recipientId || undefined,
        recipientName: recipientName || undefined,
        text,
      });
      try {
        await msg.save();
        console.log('[SOCKET] Message saved:', msg);
        if (recipientId) {
          // Private message: emit to sender and recipient only
          const recipientSocketId = io.userSockets[recipientId];
          if (recipientSocketId) {
            socket.to(recipientSocketId).emit('receive_message', msg);
          }
          // Also emit to sender
          socket.emit('receive_message', msg);
        } else {
          // Group message: emit to all
          io.emit('receive_message', msg);
        }
      } catch (saveErr) {
        console.error('[SOCKET] Mongoose save error:', saveErr.message, saveErr.stack);
      }
    } catch (err) {
      console.error('[SOCKET] Error saving/sending message', err.message, err.stack);
    }
  });

  socket.on('disconnect', () => {
    // Remove from userSockets map
    if (io.userSockets && socket.user && socket.user.id) {
      delete io.userSockets[socket.user.id];
    }
    console.log('Client disconnected: ' + socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected: ' + socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
