# Gupshup - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Git installed
- Node.js 18+ (for manual setup)

---

## ✅ Option 1: Docker (Recommended)

### 1. Clone and Navigate
```bash
git clone https://github.com/syed906/Gupshup-.git
cd Gupshup-
```

### 2. Start All Services
```bash
docker-compose up -d
```

### 3. Verify Services
```bash
# Check if all containers are running
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access the App
- **Frontend**: http://localhost:3000
- **Backend Health**: http://localhost:5000/health
- **MongoDB**: localhost:27017 (admin/password)

### 5. Stop Services
```bash
docker-compose down
```

---

## 🔧 Option 2: Manual Setup (Local Development)

### Prerequisites
- MongoDB running locally on port 27017
- Node.js 18+

### Step 1: Backend Setup
```bash
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

### Step 2: Frontend Setup (New Terminal)
```bash
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start React app
npm start
```

### Backend .env Configuration
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/gupshup
JWT_SECRET=your_jwt_secret_key_here
```

---

## 🐛 Troubleshooting

### Issue: `Refused to connect` on localhost:3000

**Solution 1: Check Docker Containers**
```bash
# Verify containers are running
docker-compose ps

# If not running, start them
docker-compose up -d

# Check logs for errors
docker-compose logs frontend
docker-compose logs backend
```

**Solution 2: Check Port Availability**
```bash
# macOS/Linux
lsof -i :3000
lsof -i :5000

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000
```

**Solution 3: Rebuild Containers**
```bash
# Remove old containers and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Wait 15-20 seconds for services to start
sleep 20

# Check logs
docker-compose logs -f
```

---

### Issue: MongoDB Connection Error

**Error Message:**
```
❌ MongoDB Connection Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Ensure MongoDB container is healthy
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb

# Wait for MongoDB to be ready
docker-compose logs -f mongodb
# Look for "waiting for connections"
```

---

### Issue: Frontend Can't Connect to Backend API

**Error:** `Failed to fetch from http://localhost:5000`

**Solution 1: Verify Backend is Running**
```bash
# Check if backend container is running
docker ps | grep backend

# Test backend health
curl http://localhost:5000/health
```

**Solution 2: Check Environment Variables**
```bash
# Inside frontend container
docker exec gupshup_frontend cat /app/.env

# Should show:
# REACT_APP_API_URL=http://localhost:5000
# REACT_APP_SOCKET_URL=http://localhost:5000
```

**Solution 3: Fix CORS Issues**
- Backend `server.js` already handles CORS properly
- Ensure `CLIENT_URL=http://localhost:3000` in backend .env

---

### Issue: WebSocket Connection Failed

**Error:** `WebSocket connection failed`

**Solution:**
```bash
# Check backend logs
docker-compose logs -f backend

# Verify Socket.io is initialized
# Should see: "✅ WebSocket ready for connections"

# Restart backend
docker-compose restart backend
```

---

### Issue: Services Won't Start (Port Already in Use)

```bash
# Find process using port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Find process using port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Then restart
docker-compose up -d
```

---

## 📊 Service Status Commands

```bash
# See all running containers
docker-compose ps

# View real-time logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Check container resource usage
docker stats gupshup_backend gupshup_frontend gupshup_mongodb

# Test API connectivity
curl -X GET http://localhost:5000/health
```

---

## 🔍 Testing Locally

### Test Backend API
```bash
# Health check
curl http://localhost:5000/health

# Frontend should be at
curl http://localhost:3000
```

### Database Access
```bash
# Connect to MongoDB from another terminal
docker exec -it gupshup_mongodb mongosh -u admin -p password

# Inside MongoDB shell
use gupshup
db.users.find()
db.messages.find()
```

---

## 📝 Environment Files

### Backend .env (Already Created)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://admin:password@mongodb:27017/gupshup?authSource=admin
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

### Frontend .env (Already Created)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 🔄 Workflow Commands

```bash
# Build without running
docker-compose build

# Build and run
docker-compose up -d

# Rebuild (useful after code changes)
docker-compose down
docker-compose up -d --build

# Clean everything
docker-compose down -v

# View compose file
docker-compose config
```

---

## 📦 Development Workflow

### Making Code Changes

**Backend Changes:**
```bash
# Changes are auto-reflected due to volumes
# If dependencies change:
docker-compose restart backend
```

**Frontend Changes:**
```bash
# Changes are auto-reflected (React hot reload)
# Check browser console for errors
```

### Restarting Services
```bash
# Restart backend only
docker-compose restart backend

# Restart frontend only
docker-compose restart frontend

# Restart all
docker-compose restart
```

---

## 🎯 Success Indicators

When everything is working:

✅ `docker-compose ps` shows all containers as "Up"
✅ `curl http://localhost:5000/health` returns `{"status":"Server is running"}`
✅ Frontend loads at http://localhost:3000
✅ Browser console shows no CORS errors
✅ WebSocket connection established (check Network tab)
✅ MongoDB shows "waiting for connections" in logs

---

## 💡 Quick Fixes Checklist

- [ ] Services running? → `docker-compose ps`
- [ ] Ports available? → `lsof -i :3000` / `lsof -i :5000`
- [ ] MongoDB healthy? → `docker-compose logs mongodb`
- [ ] Environment files created? → Check `.env` files exist
- [ ] Containers built? → `docker-compose build --no-cache`
- [ ] Fresh start needed? → `docker-compose down -v && docker-compose up -d`

---

## 🆘 Still Having Issues?

1. **Clear everything and restart:**
   ```bash
   docker-compose down -v
   rm -rf backend/node_modules frontend/node_modules
   docker-compose build --no-cache
   docker-compose up -d
   ```

2. **Check logs for specific errors:**
   ```bash
   docker-compose logs backend 2>&1 | grep -i error
   ```

3. **Verify connectivity:**
   ```bash
   docker exec gupshup_backend ping mongodb
   docker exec gupshup_frontend curl http://backend:5000/health
   ```

---

**Happy Coding! 🎉**
