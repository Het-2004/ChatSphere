# ChatSphere - Complete Setup Guide

## 🚀 Quick Start (For Beginners)

### Prerequisites
- ✅ Windows 10/11
- ✅ MongoDB installed and running
- ✅ Node.js 18+ installed
- ✅ Java JDK 21 (already configured)

### Step 1: Start Everything
```powershell
# Navigate to project folder
cd d:\Project\ChatSphere

# Run the launcher
.\run_chatsphere.bat
```

That's it! The script will:
1. Set the correct Java version
2. Start the backend server
3. Start the frontend app

### Step 2: Open the App
Open your browser and go to: **http://localhost:5173**

### Step 3: Create an Account
1. Click "Sign Up"
2. Enter your email and password
3. Complete the CAPTCHA
4. Click "Create Account"

### Step 4: Start Chatting!
1. Log in with your credentials
2. Create a new chat
3. Start messaging!

---

## 📋 Manual Setup (If Launcher Doesn't Work)

### Backend Setup
```powershell
# Terminal 1
cd d:\Project\ChatSphere\chatsphere-backend

# Make sure MongoDB is running first!
# Then start the backend
mvn spring-boot:run

# Wait for: "Started ChatSphereApplication"
```

### Frontend Setup
```powershell
# Terminal 2
cd d:\Project\ChatSphere\chatsphere-frontend

# Install dependencies (first time only)
npm install

# Start the frontend
npm run dev

# Wait for: "Local: http://localhost:5173/"
```

---

## 🧪 Testing the Application

### Run Automated Tests
```powershell
cd d:\Project\ChatSphere
powershell -ExecutionPolicy Bypass -File test_api.ps1
```

This will test all API endpoints and show you what's working.

---

## 🔧 Troubleshooting

### Problem: "MongoDB connection failed"
**Solution:**
1. Check if MongoDB is running:
   ```powershell
   Get-Service MongoDB
   ```
2. If not running, start it:
   ```powershell
   Start-Service MongoDB
   ```
3. If MongoDB is not installed, download from: https://www.mongodb.com/try/download/community

### Problem: "Port 4040 already in use"
**Solution:**
1. Find what's using the port:
   ```powershell
   netstat -ano | findstr :4040
   ```
2. Kill the process or change the port in `application.yaml`

### Problem: "Frontend won't start"
**Solution:**
1. Delete `node_modules` and reinstall:
   ```powershell
   cd chatsphere-frontend
   Remove-Item -Recurse -Force node_modules
   npm install
   ```

### Problem: "Backend won't compile"
**Solution:**
1. Clean and rebuild:
   ```powershell
   cd chatsphere-backend
   mvn clean package -DskipTests
   ```

### Problem: "Can't log in / signup"
**Solution:**
1. Check backend logs for errors
2. Make sure MongoDB is running
3. Clear browser cache and cookies
4. Try a different email address

---

## 📚 Features Guide

### Authentication
- **Signup**: Create a new account with email/password
- **Login**: Access your account
- **Logout**: Sign out securely
- **Password Reset**: Recover your account (email required)

### Messaging
- **Real-Time Chat**: Messages appear instantly
- **Typing Indicators**: See when someone is typing
- **Online Status**: See who's online
- **Message History**: All messages are saved

### Security
- **JWT Authentication**: Secure token-based auth
- **End-to-End Encryption**: Optional E2E encryption
- **Rate Limiting**: Protection against spam
- **Input Sanitization**: XSS protection

### Advanced Features
- **File Sharing**: Send images and files
- **Presence System**: Online/offline/away status
- **Message Reactions**: React to messages
- **Search**: Find messages and users

---

## 🎯 What to Do Next

### For Beginners:
1. ✅ Get the app running
2. ✅ Create an account
3. ✅ Send your first message
4. ✅ Explore the UI

### For Intermediate Users:
1. ✅ Test file uploads
2. ✅ Try multiple users (different browsers)
3. ✅ Explore WebSocket connections
4. ✅ Check the database in MongoDB Compass

### For Advanced Users:
1. ✅ Enable E2E encryption
2. ✅ Modify the code
3. ✅ Add new features
4. ✅ Deploy to production

---

## 📞 Need Help?

### Check the Logs
**Backend logs:** Look in the terminal running `mvn spring-boot:run`
**Frontend logs:** Press F12 in browser → Console tab

### Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Connection refused" | Backend not running | Start backend first |
| "Network Error" | Wrong API URL | Check `.env` file |
| "401 Unauthorized" | Invalid token | Log out and log in again |
| "400 Bad Request" | Invalid data | Check form inputs |
| "500 Internal Error" | Server crash | Check backend logs |

---

## 🎓 Learning Resources

### Understanding the Code
- **Backend**: Spring Boot + MongoDB
- **Frontend**: React + Vite
- **Real-Time**: WebSocket
- **Security**: JWT + Encryption

### File Structure
```
chatsphere-backend/
├── src/main/java/com/chatsphere/
│   ├── auth/          ← Login/Signup logic
│   ├── chat/          ← Chat features
│   ├── websocket/     ← Real-time messaging
│   └── config/        ← App configuration

chatsphere-frontend/
├── src/
│   ├── auth/          ← Login/Signup UI
│   ├── components/    ← Reusable UI components
│   ├── api/           ← Backend communication
│   └── websocket/     ← WebSocket client
```

---

## ✨ Tips for Success

1. **Always start MongoDB first** before the backend
2. **Wait for backend to fully start** before opening frontend
3. **Use Chrome/Edge** for best compatibility
4. **Check the console** (F12) if something doesn't work
5. **Clear cache** if you see old data
6. **Use test_api.ps1** to verify backend is working

---

**Enjoy ChatSphere! 🎉**
