import express from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import authRoutes from './routes/authRoutes.js';
import oauthRoutes from './routes/oauthRoutes.js';
import { configurePassport } from './config/passport.js';
import 'dotenv/config'

import { handleChat } from './controllers/chatController.js';
import { redirectLoginPage, verifyTokenCookie } from './middleware/authMiddleware.js';
import { handleGameProjectile } from './socket/handlerEvent.js';
import { handleBlockLand } from './socket/blockland.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
    cors: {
      origin: "http://localhost:3000", 
      methods: ["GET", "POST"],
      credentials: true
    }
  });

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true })); 
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public','libs')));
app.use(express.static(path.join(__dirname, 'public','blockland','v3')));
app.use(express.static(path.join(__dirname, 'pages')));
configurePassport(passport); 

// JWT verification for WebSocket connections

// Expose Socket.io to other files
app.set('socketio', io);

// Real-time communication with Socket.io
io.on('connection', (socket) => {
  console.log(`User connected`); // Log authenticated user's email


    // Handle chat messages in real-time
    handleChat(socket, io);
  
    //
 handleGameProjectile(socket, io);
 handleBlockLand(socket, io);
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
});


// Routes
app.get('/blockland',verifyTokenCookie, (req, res) => {
  
  console.log(req.user)
  res.sendFile(__dirname+'/public/blockland/v3/index.html')
});
app.get('/starwar',verifyTokenCookie, (req, res) => {
  
  console.log(req.user)
  res.sendFile(__dirname+'/public/game.html')
});
app.get('/profile',verifyTokenCookie, (req, res) => {
  
  console.log(req.user)
  res.sendFile(__dirname+'/pages/profile.html')
});
app.use('/api/auth', authRoutes);
app.use('/api/oauth', oauthRoutes);

// Database connection
mongoose.connect(process.env.DB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
