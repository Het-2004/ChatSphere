<h1>Wellcome to this repository!</h1>

### 🧠 Backend Structure (Spring Boot + Security first)


    chatsphere-backend/
    ├── pom.xml
    └── src/
        └── main/
            ├── java/com/chatsphere/
            │   ├── ChatSphereApplication.java
            │
            │   ├── config/
            │   │   ├── SecurityConfig.java
            │   │   ├── JwtFilter.java
            │   │   ├── JwtService.java
            │   │   ├── WebSocketConfig.java
            │   │   └── RateLimitConfig.java
            │
            │   ├── controller/
            │   │   ├── AuthController.java
            │   │   ├── ChatController.java
            │   │   └── UserController.java
            │
            │   ├── dto/
            │   │   ├── LoginRequest.java
            │   │   ├── RegisterRequest.java
            │   │   └── MessageDTO.java
            │
            │   ├── model/
            │   │   ├── User.java
            │   │   ├── ChatMessage.java
            │   │   └── Role.java
            │
            │   ├── repository/
            │   │   ├── UserRepository.java
            │   │   └── MessageRepository.java
            │
            │   ├── service/
            │   │   ├── AuthService.java
            │   │   ├── UserService.java
            │   │   ├── ChatService.java
            │   │   └── EncryptionService.java
            │
            │   ├── websocket/
            │   │   ├── ChatSocketHandler.java
            │   │   └── JwtHandshakeInterceptor.java
            │
            │   ├── exception/
            │   │   ├── GlobalExceptionHandler.java
            │   │   └── CustomException.java
            │
            │   └── util/
            │       ├── KeyGeneratorUtil.java
            │       └── DateUtil.java
            │
            └── resources/
                ├── application.properties
                └── logback-spring.xml


### 🎨 FRONTEND STRUCTURE (REACT – CLEAN & SCALABLE)

    chatsphere-frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
         ├── api/
        │   └── axiosConfig.js
        │
        ├── components/
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   │
        │   ├── chat/
        │   │   ├── ChatWindow.jsx
        │   │   ├── MessageBubble.jsx
        │   │   ├── ChatHeader.jsx
        │   │   └── TypingIndicator.jsx
        │   │
        │   └── common/
        │       └── Loader.jsx
        │
        ├── services/
        │   ├── authService.js
        │   ├── socketService.js
        │   └── encryptionService.js
        │
        ├── context/
        │   └── AuthContext.jsx
        │
        ├── styles/
        │   ├── auth.css
        │   └── chat.css
        │
        ├── App.jsx
        └── index.js


### 🗄️ DATABASE STRUCTURE (MONGODB – SECURE) 

Database: chatsphere

users
{
  _id,
  username,
  passwordHash,
  publicKey,
  role,
  online,
  createdAt
}

messages
{
  _id,
  senderId,
  receiverId,
  encryptedContent,
  status,
  timestamp
}