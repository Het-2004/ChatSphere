<h1>Wellcome to this repository!</h1>

### 🧠 Backend Structure (Spring Boot + Security first)


    chatsphere-backend/
    ├── pom.xml
    └── src/main/
        ├── java/com/chatsphere/
        │   ├── ChatSphereApplication.java
        │
        │   ├── config/
        │   │   ├── SecurityConfig.java
        │   │   ├── JwtAuthenticationFilter.java
        │   │   ├── JwtService.java
        │   │   ├── CorsConfig.java
        │   │   ├── RateLimitConfig.java
        │   │   ├── WebSocketConfig.java
        │   │   └── HttpsConfig.java
        │
        │   ├── controller/
        │   │   ├── AuthController.java
        │   │   ├── ChatController.java
        │   │   └── UserController.java
        │
        │   ├── dto/
        │   │   ├── LoginRequest.java
        │   │   ├── RegisterRequest.java
        │   │   ├── MessageRequest.java
        │   │   └── UserResponse.java
        │
        │   ├── model/
        │   │   ├── User.java
        │   │   ├── ChatMessage.java
        │   │   ├── Role.java
        │   │   └── MessageStatus.java
        │
        │   ├── repository/
        │   │   ├── UserRepository.java
        │   │   └── MessageRepository.java
        │
        │   ├── service/
        │   │   ├── AuthService.java
        │   │   ├── UserService.java
        │   │   ├── ChatService.java
        │   │   ├── EncryptionService.java
        │   │   └── TokenBlacklistService.java
        │
        │   ├── websocket/
        │   │   ├── ChatSocketHandler.java
        │   │   ├── JwtHandshakeInterceptor.java
        │   │   └── PresenceService.java
        │
        │   ├── security/
        │   │   ├── CustomUserDetails.java
        │   │   ├── CustomUserDetailsService.java
        │   │   └── SecurityUtils.java
        │
        │   ├── exception/
        │   │   ├── GlobalExceptionHandler.java
        │   │   ├── AuthException.java
        │   │   └── AccessDeniedException.java
        │
        │   └── util/
        │       ├── KeyGeneratorUtil.java
        │       ├── IpUtils.java
        │       └── DateUtil.java
        │
        └── resources/
            ├── application.properties
            ├── application-prod.yml
            ├── keystore.p12
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