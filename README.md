# Gupshup - Social Media Messaging App

A WhatsApp-like social media application with real-time messaging, audio/video calling, and file sharing capabilities.

## Features

✨ **Core Features:**
- Real-time text messaging
- Audio calling
- Video calling
- File sharing (documents, images, videos)
- User profiles and authentication
- Online/offline status
- Typing indicators
- Call history

## Tech Stack

**Frontend:**
- React 18
- Socket.io Client
- SimplePeer (WebRTC)
- Axios
- TailwindCSS
- React Router

**Backend:**
- Node.js & Express
- Socket.io
- MongoDB
- JWT Authentication
- Multer (File uploads)
- AWS S3 (File storage)

## Project Structure

```
Gupshup-/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── messages.js
│   │   ├── files.js
│   │   └── calls.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   ├── Call.js
│   │   └── File.js
│   ├── middleware/
│   ├── server.js
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx
│   │   │   ├── VideoCall.jsx
│   │   │   ├── AudioCall.jsx
│   │   │   └── FileUpload.jsx
│   │   ├── pages/
│   │   │   ├── ChatPage.jsx
│   │   │   ├── CallPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── .env.example
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Installation

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/syed906/Gupshup-.git
cd Gupshup-

# Start all services
docker-compose up -d
```

Access the app at: http://localhost:3000

### Manual Installation

**Backend:**
```bash
cd backend
cp .env.example .env
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gupshup
JWT_SECRET=your_secret_key
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/search/:query` - Search users

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:userId/:recipientId` - Get messages
- `DELETE /api/messages/:messageId` - Delete message

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files/shared/:userId` - Get shared files
- `DELETE /api/files/:fileId` - Delete file

### Calls
- `POST /api/calls` - Initiate call
- `GET /api/calls/history/:userId` - Get call history
- `PUT /api/calls/:callId` - Update call status

## WebSocket Events

### Client to Server
- `user_online` - User comes online
- `send_message` - Send message
- `typing` - User is typing
- `video_call_signal` - Video call signal
- `audio_call_signal` - Audio call signal
- `call_response` - Respond to call
- `end_call` - End call
- `file_upload_progress` - File upload progress

### Server to Client
- `user_status` - User status update
- `receive_message` - Receive message
- `user_typing` - User typing indicator
- `incoming_video_call` - Incoming video call
- `incoming_audio_call` - Incoming audio call
- `call_response` - Call response
- `call_ended` - Call ended
- `file_progress_update` - File upload progress

## Database Models

### User
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  avatar: String,
  bio: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  _id: ObjectId,
  senderId: ObjectId,
  recipientId: ObjectId,
  text: String,
  attachment: String,
  read: Boolean,
  createdAt: Date
}
```

### Call
```javascript
{
  _id: ObjectId,
  callerId: ObjectId,
  recipientId: ObjectId,
  callType: String, // 'audio' or 'video'
  status: String,
  duration: Number,
  startedAt: Date,
  endedAt: Date
}
```

## Development

### Running in Development Mode

```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm start
```

## Deployment

### Using Docker

```bash
# Build and push images
docker-compose build
docker-compose push

# Deploy to production
docker-compose -f docker-compose.yml up -d
```

## Future Enhancements

- [ ] End-to-end encryption (E2E)
- [ ] Message reactions & emojis
- [ ] Group chats
- [ ] Voice messages
- [ ] Message search
- [ ] Read receipts
- [ ] Screen sharing
- [ ] User blocking
- [ ] Dark mode
- [ ] Push notifications

## Contributing

Contributions are welcome! Please fork the repository and create a pull request.

## License

MIT License - See LICENSE file for details

## Support

For support, email support@gupshup.app or open an issue on GitHub.

## Author

**Syed** - [GitHub](https://github.com/syed906)

---

**Gupshup** © 2024. All rights reserved.
