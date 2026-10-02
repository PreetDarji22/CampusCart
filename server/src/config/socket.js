import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  // Socket middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        socket.userId = decoded.id;
      } catch (err) {
        console.log('[Socket Auth Note] Anonymous / Unverified socket connection');
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id} (User: ${socket.userId || 'Guest'})`);

    // Join user specific room for notifications
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Join specific chat room
    socket.on('join_chat', (chatId) => {
      socket.join(`chat:${chatId}`);
      console.log(`[Socket.io] ${socket.id} joined room chat:${chatId}`);
    });

    // Leave chat room
    socket.on('leave_chat', (chatId) => {
      socket.leave(`chat:${chatId}`);
    });

    // Typing indicator
    socket.on('typing', ({ chatId, isTyping, userName }) => {
      socket.to(`chat:${chatId}`).emit('user_typing', { chatId, isTyping, userName });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
