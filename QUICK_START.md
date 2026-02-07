# ChatSphere - Quick Start Guide

## Prerequisites

### Backend Requirements
- Java 17+
- Maven 3.8+
- MongoDB running on `localhost:27017`
- **Google reCAPTCHA v3 keys** (see Security Configuration below)

### Frontend Requirements
- Node.js 16+
- npm or yarn

---

## Security Configuration (IMPORTANT)

### reCAPTCHA Setup
Before running the application, configure Google reCAPTCHA v3:

1. **Get reCAPTCHA Keys**
   - Visit [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
   - Create a new site with reCAPTCHA v3
   - Note the **Site Key** (for frontend) and **Secret Key** (for backend)

2. **Set Backend Environment Variable**
   ```bash
   # Windows
   set RECAPTCHA_SECRET_KEY=your_secret_key_here
   
   # Linux/Mac
   export RECAPTCHA_SECRET_KEY=your_secret_key_here
   ```

3. **Development Mode (Optional)**
   To disable CAPTCHA during development:
   - Edit `chatsphere-backend/src/main/resources/application-prod.yml`
   - Set `recaptcha.enabled: false`

---

## Running the Backend

### 1. Start MongoDB
```bash
# Option A: Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Option B: If installed locally
mongod
```

### 2. Set Environment Variables
```bash
# Required: reCAPTCHA secret key
set RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### 3. Build Backend
```bash
cd chatsphere-backend
mvn clean install
```

### 4. Run Backend
```bash
mvn spring-boot:run
```

**Expected Output:**
```
ChatsphereBackendApplication : Started ChatsphereBackendApplication in X.XXX seconds
Server running on port 4040
```

---

## Running the Frontend

### 1. Install Dependencies
```bash
cd chatsphere-frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

**Expected Output:**
```
  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

---

## Verify Everything Works

### ✅ Check Backend is Running
```bash
curl http://localhost:4040/api/auth/me
# Should return: Unauthorized (401)
```

### ✅ Check Frontend is Running
Open browser to: `http://localhost:5173`
- Should see login page
- No CORS errors in console

### ✅ Test Full Authentication Flow
1. **Signup**
   - Go to signup page
   - Enter email: `test@example.com`
   - Password: `StrongP@ss123` (must meet strength requirements)
   - Complete reCAPTCHA (if enabled)
   - Click Signup
   - **Note**: Password must have 8+ chars, uppercase, lowercase, digit, and special character

2. **Login**
   - Go to login page
   - Enter credentials
   - Complete reCAPTCHA (if enabled)
   - Click Login
   - Should redirect to chat page

3. **Create Chat**
   - Click "+" button to create new chat
   - Search for a user (or use another test account)
   - Select user to create 1-to-1 chat

4. **Send Message**
   - Type a message
   - Press Enter or click send
   - Message should appear in chat

---

## Common Issues & Solutions

### Issue: "Connection refused" on backend
**Solution:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB if not running
mongod
```

### Issue: "CAPTCHA verification failed"
**Solution:**
1. Ensure `RECAPTCHA_SECRET_KEY` environment variable is set
2. Check that frontend is sending valid CAPTCHA token
3. Verify reCAPTCHA keys are correct (site key vs secret key)
4. For development, disable CAPTCHA in `application-prod.yml`:
   ```yaml
   recaptcha:
     enabled: false
   ```

### Issue: "Password does not meet requirements"
**Solution:**
- Password must be at least 8 characters
- Must contain uppercase letter (A-Z)
- Must contain lowercase letter (a-z)
- Must contain digit (0-9)
- Must contain special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)
- Example valid password: `StrongP@ss123`

### Issue: "Too many requests" (HTTP 429)
**Solution:**
- **Signup**: Wait 1 hour before trying again (3 attempts per hour per IP)
- **Login**: Wait a few minutes (5 attempts per minute per email)
- Rate limits reset automatically after the time window
- For development, you can restart the backend to reset limits

### Issue: "Validation failed" errors
**Check:**
1. Email format is valid (e.g., `user@example.com`)
2. Password meets strength requirements
3. All required fields are provided
4. CAPTCHA token is included in request
5. Check browser console for detailed error messages

### Issue: CORS errors in browser console
**Solution:**
- This is normal for development
- Backend CORS is configured to allow all origins
- Check browser console for actual error messages

### Issue: WebSocket connection fails
**Verify:**
1. Backend is running on port 4040
2. JWT token is being sent in URL query parameter
3. Check browser Network tab → WS tab

### Issue: 2FA OTP not appearing
**Solution:**
- In development, OTP is logged to console
- Check backend terminal output
- Look for message: "2FA OTP for [email]: [code]"

### Issue: Messages not sending
**Check:**
1. WebSocket is connected (browser Network tab)
2. Both users are in the same chat
3. No JavaScript errors in console
4. Backend logs show message being saved

---

## Project Structure

```
ChatSphere/
├── chatsphere-backend/          # Spring Boot Backend
│   ├── src/main/java/com/chatsphere/
│   │   ├── auth/                # Authentication & JWT
│   │   ├── chat/                # Chat & Message logic
│   │   ├── config/              # Configuration beans
│   │   ├── model/               # Database models
│   │   ├── repository/          # Data access
│   │   ├── security/            # Security filters & CAPTCHA
│   │   ├── user/                # User management
│   │   ├── util/                # Validation utilities
│   │   ├── websocket/           # WebSocket handlers
│   │   └── presence/            # Online status
│   ├── src/main/resources/
│   │   └── application-prod.yml # Configuration
│   └── pom.xml                  # Maven dependencies
│
├── chatsphere-frontend/         # React Frontend
│   ├── src/
│   │   ├── api/                 # HTTP client services
│   │   ├── auth/                # Auth pages & components
│   │   ├── components/          # React components
│   │   ├── context/             # Context providers
│   │   ├── crypto/              # Encryption utilities
│   │   ├── hooks/               # Custom hooks
│   │   ├── pages/               # Page components
│   │   ├── styles/              # CSS styles
│   │   ├── utils/               # Utility functions
│   │   ├── websocket/           # WebSocket client
│   │   ├── App.jsx              # Root component
│   │   └── main.jsx             # Entry point
│   ├── package.json             # Dependencies
│   └── vite.config.js           # Vite configuration
│
└── docs/                        # Documentation
    ├── architecture.md
    ├── api.md
    ├── security.md
    └── deployment.md
```

---

## Key Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user (requires CAPTCHA token)
  ```json
  {
    "email": "user@example.com",
    "password": "StrongP@ss123",
    "captchaToken": "reCAPTCHA_token_here"
  }
  ```
- `POST /api/auth/login` - Login user (requires CAPTCHA token)
  ```json
  {
    "email": "user@example.com",
    "password": "StrongP@ss123",
    "captchaToken": "reCAPTCHA_token_here"
  }
  ```
- `POST /api/auth/verify-2fa` - Verify 2FA OTP
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Chats
- `GET /api/chats` - List user's chats
- `POST /api/chats` - Create/get 1-to-1 chat
- `GET /api/messages/{chatId}` - Get messages
- `POST /api/groups` - Create group chat
- `PUT /api/chats/{chatId}/members` - Add group member

### Users
- `GET /api/users/search?query=text` - Search users

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files/download/{fileName}` - Download file

### WebSocket
- `WS /ws/chat?token={jwt}` - Real-time messaging

---

## Architecture

### Authentication Flow
```
User → Signup → Email/Password Validated & Stored (BCrypt)
     ↓
     CAPTCHA Verified → Rate Limit Checked
     ↓
     Login → JWT Generated → Token Stored (localStorage)
     ↓
     Protected Routes → JWT Validated
     ↓
     WebSocket → Token in Query String
```

### Message Flow
```
Frontend (Encrypted) → WebSocket → Backend (Stored As-Is)
                   ↓
                   Broadcast to Chat Participants
                   ↓
                   Frontend (Decrypt Client-Side)
```

### Real-Time Features
- **Typing Indicators**: WebSocket event broadcast
- **Presence**: Online status, last seen timestamp
- **Reactions**: Emoji reactions on messages
- **Audio**: Voice message recording & playback
- **Forwarding**: Message forwarding with context

---

## Database

### MongoDB Collections
- `users` - User accounts and profiles
- `chats` - 1-to-1 and group chats
- `messages` - Encrypted messages

### Key Indexes
- `users.email` (unique, indexed)
- `messages.chatId` (indexed)
- `chats.participants` (indexed)

---

## Security Features

✅ **Authentication**: JWT tokens (24-hour expiration)  
✅ **2FA**: OTP-based two-factor authentication  
✅ **Encryption**: Client-side message encryption (E2EE)  
✅ **CORS**: Configured for development  
✅ **Password**: BCrypt hashing with strength validation  
✅ **WebSocket**: JWT validation on handshake  
✅ **Rate Limiting**: Per-IP signup limits, per-email login limits  
✅ **Access Control**: User membership verification  
✅ **Input Validation**: Server-side validation with custom annotations  
✅ **XSS Protection**: Input sanitization and CSP headers  
✅ **CAPTCHA**: Google reCAPTCHA v3 on signup/login  
✅ **Security Headers**: HSTS, CSP, COEP, COOP, CORP, X-Frame-Options  
✅ **Exception Handling**: Secure error messages (no information leakage)

### Password Requirements
Passwords must meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one digit (0-9)
- At least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)

### Rate Limiting
- **Signup**: 3 attempts per hour per IP address
- **Login**: 5 attempts per minute per email address
- **API**: 30 requests per minute per user
- **Messages**: 10 messages per minute per user

---

## Development Tips

### Hot Reload
- **Backend**: Use Spring Boot DevTools (automatic restart)
- **Frontend**: Vite hot module replacement (automatic reload)

### Debugging
- **Backend**: Check application logs in terminal
- **Frontend**: Use browser DevTools (F12) for console logs
- **WebSocket**: Network tab in DevTools → WS filter
- **Validation**: Check browser console for detailed validation errors

### Testing Locally
- Create multiple browser windows/tabs to test 2+ users
- Use incognito/private mode for separate sessions
- Use browser DevTools to monitor WebSocket messages
- Check backend terminal for CAPTCHA verification logs

---

## Production Deployment

Before deploying to production:

1. **Update Configuration**
   ```yaml
   jwt.secret: <generate-strong-secret>
   spring.data.mongodb.uri: <production-mongodb>
   frontend.url: <your-domain>
   recaptcha.secret-key: <your-production-key>
   ```

2. **Enable HTTPS**
   - Configure SSL certificate in application-prod.yml
   - Update frontend WebSocket to `wss://`

3. **Environment Variables**
   - Move secrets to environment variables
   - Use `.env` files (never commit secrets)
   - Set `RECAPTCHA_SECRET_KEY` in production environment

4. **Database Backups**
   - Enable MongoDB replication
   - Set up automated backups

5. **Monitoring**
   - Enable application logging
   - Set up error tracking (Sentry, etc.)
   - Monitor WebSocket connections
   - Track rate limit violations

6. **Security Hardening**
   - Enable CAPTCHA in production (`recaptcha.enabled: true`)
   - Review and tighten CSP policies
   - Configure proper CORS origins (remove wildcard)
   - Enable security header tests

---

## Support & Documentation

- [Architecture Guide](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Security Guide](./docs/security.md)
- [Deployment Guide](./docs/deployment.md)

---

**Happy Chatting! 💬**
