const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/files', require('./routes/files'));
app.use('/api/calls', require('./routes/calls'));

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Socket.io Events
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User Online
  socket.on('user_online', (userId) => {
    socket.join(`user_${userId}`);
    io.emit('user_status', { userId, status: 'online' });
  });

  // Send Message
  socket.on('send_message', (data) => {
    io.to(`user_${data.recipientId}`).emit('receive_message', data);
  });

  // Typing Indicator
  socket.on('typing', (data) => {
    io.to(`user_${data.recipientId}`).emit('user_typing', { senderId: data.senderId });
  });

  // Video Call Signal
  socket.on('video_call_signal', (data) => {
    io.to(`user_${data.recipientId}`).emit('incoming_video_call', {
      callerId: data.callerId,
      signal: data.signal
    });
  });

  // Audio Call Signal
  socket.on('audio_call_signal', (data) => {
    io.to(`user_${data.recipientId}`).emit('incoming_audio_call', {
      callerId: data.callerId,
      signal: data.signal
    });
  });

  // Call Response
  socket.on('call_response', (data) => {
    io.to(`user_${data.callerId}`).emit('call_response', data);
  });

  // End Call
  socket.on('end_call', (data) => {
    io.to(`user_${data.recipientId}`).emit('call_ended', data);
  });

  // File Upload Progress
  socket.on('file_upload_progress', (data) => {
    io.to(`user_${data.recipientId}`).emit('file_progress_update', data);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    io.emit('user_status', { userId: socket.id, status: 'offline' });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
