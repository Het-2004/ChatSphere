# 🌐 ChatSphere

ChatSphere is a premium, real-time chat application with End-to-End Encryption (E2EE), focusing on security, aesthetics, and performance.

---

## 🚀 Vision
A secure communication platform where privacy is the default. Every message is encrypted client-side using RSA-AES, ensuring that only you and your recipient can read your conversations.

---

## ✨ Key Features
- **End-to-End Encryption (E2EE)**: RSA/AES based secure messaging.
- **Real-time Performance**: WebSocket-driven chat and presence updates.
- **Message Persistence**: Full history loading from MongoDB.
- **Modern UI/UX**: Glassmorphism design, responsive layouts, and rich animations.
- **Profile Management**: Customizable avatars, bios, and unique usernames.

---

## 🛡️ Recent Fixes & Stability
The application has recently undergone significant stability improvements:
- **Presence Loop Fix**: Resolved WebSocket connection hanging issues.
- **Log Management**: Implemented size-capped and time-rotated logging (10MB caps, 3-day history).
- **Performance Tuning**: Optimized chat loading by removing synchronous database checks.
- **Database Hotfix**: Resolved duplicate key errors on the user profile fields.

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Context API.
- **Backend**: Spring Boot 3.4.1, Spring Security, MongoDB.
- **Encryption**: AES-256-GCM, RSA, BCrypt.

---

## 📥 Getting Started

### Prerequisites
- Java 17+ or 21+
- Node.js 18+
- MongoDB running locally on `localhost:27017`

### Backend
```bash
cd chatsphere-backend
mvn clean install -DskipTests
java -jar target/chatsphere-backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd chatsphere-frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

---

## 📝 Detailed Documentation
For the absolute master reference containing all architecture, features, and setup steps in one place, see:
- **[full_details.md](file:///d:/Project/ChatSphere/full_details.md)**: The complete project documentation.

Other technical artifacts in the `.gemini/antigravity/brain` directory:
- `master_blueprint.md`: Deep dive into architecture and flows.
- `project_summary.md`: General project overview.
- `setup_guide.md`: Step-by-step installation and troubleshooting.
- `walkthrough.md`: Technical implementation walkthrough of key features.
- `feature_summary.md`: Detailed breakdown of all implemented features.