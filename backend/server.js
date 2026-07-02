const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gupshup', mongooseOptions);
    console.log('✅ MongoDB Connected Successfully');
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    // Retry after 5 seconds
    setTimeout(connectDB, 5000);
    return false;
  }
};

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/files', require('./routes/files'));
app.use('/api/calls', require('./routes/calls'));

// Health check endpoint
app.get('/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: 'Server is running',
    timestamp: new Date(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Gupshup Backend API is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      messages: '/api/messages',
      files: '/api/files',
      calls: '/api/calls'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date()
  });
});

// Socket.io Events
io.on('connection', (socket) => {
  console.log('✅ New user connected:', socket.id);

  // User Online
  socket.on('user_online', (userId) => {
    socket.join(`user_${userId}`);
    io.emit('user_status', { userId, status: 'online', timestamp: new Date() });
    console.log(`📍 User ${userId} is online`);
  });

  // Send Message
  socket.on('send_message', (data) => {
    io.to(`user_${data.recipientId}`).emit('receive_message', {
      ...data,
      timestamp: new Date()
    });
    console.log(`💬 Message sent from ${data.senderId} to ${data.recipientId}`);
  });

  // Typing Indicator
  socket.on('typing', (data) => {
    io.to(`user_${data.recipientId}`).emit('user_typing', {
      senderId: data.senderId,
      isTyping: true
    });
  });

  // Stop Typing
  socket.on('stop_typing', (data) => {
    io.to(`user_${data.recipientId}`).emit('user_typing', {
      senderId: data.senderId,
      isTyping: false
    });
  });

  // Video Call Signal
  socket.on('video_call_signal', (data) => {
    io.to(`user_${data.recipientId}`).emit('incoming_video_call', {
      callerId: data.callerId,
      callerName: data.callerName,
      signal: data.signal,
      timestamp: new Date()
    });
    console.log(`📹 Video call from ${data.callerId} to ${data.recipientId}`);
  });

  // Audio Call Signal
  socket.on('audio_call_signal', (data) => {
    io.to(`user_${data.recipientId}`).emit('incoming_audio_call', {
      callerId: data.callerId,
      callerName: data.callerName,
      signal: data.signal,
      timestamp: new Date()
    });
    console.log(`📞 Audio call from ${data.callerId} to ${data.recipientId}`);
  });

  // Call Response (Accept/Reject)
  socket.on('call_response', (data) => {
    io.to(`user_${data.callerId}`).emit('call_response', {
      ...data,
      timestamp: new Date()
    });
    console.log(`📞 Call response from ${data.recipientId} to ${data.callerId}: ${data.accepted ? 'accepted' : 'rejected'}`);
  });

  // Send Signal (WebRTC)
  socket.on('send_signal', (data) => {
    io.to(`user_${data.recipientId}`).emit('receive_signal', {
      signal: data.signal,
      callerId: data.callerId
    });
  });

  // End Call
  socket.on('end_call', (data) => {
    io.to(`user_${data.recipientId}`).emit('call_ended', {
      callerId: data.callerId,
      duration: data.duration,
      timestamp: new Date()
    });
    console.log(`📵 Call ended between ${data.callerId} and ${data.recipientId}`);
  });

  // File Upload Progress
  socket.on('file_upload_progress', (data) => {
    io.to(`user_${data.recipientId}`).emit('file_progress_update', {
      senderId: data.senderId,
      progress: data.progress,
      fileName: data.fileName
    });
  });

  // File Uploaded
  socket.on('file_uploaded', (data) => {
    io.to(`user_${data.recipientId}`).emit('file_received', {
      senderId: data.senderId,
      fileName: data.fileName,
      fileSize: data.fileSize,
      fileUrl: data.fileUrl,
      timestamp: new Date()
    });
    console.log(`📤 File uploaded from ${data.senderId} to ${data.recipientId}`);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
    io.emit('user_status', {
      userId: socket.id,
      status: 'offline',
      timestamp: new Date()
    });
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Gupshup Backend Server`);
  console.log(`${'='.repeat(50)}`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 WebSocket ready for connections`);
  console.log(`${'='.repeat(50)}\n`);
});

module.exports = { app, server, io };
