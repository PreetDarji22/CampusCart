import dotenv from 'dotenv';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import app from './app.js';
import connectDB from './src/config/db.js';
import { initSocket } from './src/config/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Environment Variables
dotenv.config();

// Ensure public/uploads directory exists
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect to MongoDB Database (Atlas Cloud / Local)
connectDB();

// Create HTTP Server
const server = http.createServer(app);

// Attach Socket.io for Real-time messaging
initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
  ======================================================
  🎓 CampusCart Server Running on Port ${PORT}
  🚀 Environment: ${process.env.NODE_ENV || 'development'}
  🔗 API URL: http://localhost:${PORT}/api
  ======================================================
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection]', err.name, err.message);
  server.close(() => process.exit(1));
});
