    ChatSphere/
    ├── backend/
    │   ├── src/main/java/com/chatsphere/
    │   │   ├── auth/
    │   │   ├── security/
    │   │   ├── websocket/
    │   │   ├── chat/
    │   │   ├── presence/
    │   │   ├── crypto/
    │   │   └── config/
    │   ├── Dockerfile
    │   └── application.yml
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── context/
    │   │   ├── websocket/
    │   │   └── crypto/
    │   ├── Dockerfile
    │   └── vite.config.js
    │
    ├── docker/
    │   ├── docker-compose.yml
    │
    ├── docs/
    │   ├── architecture.md
    │   ├── security.md
    │   ├── api.md
    │   └── deployment.md
    │
    ├── README.md
    └── .github/workflows/
        └── ci-cd.yml


    PHASE 1 — Backend Core (Security First)

    1.Spring Boot + MongoDB base
    2.User model & repositories
    3.JWT authentication
    4.Secure REST APIs

    PHASE 2 — WebSocket & Real-Time

    1.Secure WebSocket (JWT handshake)
    2.Real-time messaging
    3.Message acknowledgements
    4.Typing indicators

    PHASE 3 — Presence System

    1.Online / offline
    2.Last seen
    3.Redis integration

    PHASE 4 — Message Queue

    1.Kafka / RabbitMQ
    2.Async delivery
    3.Retry & fault tolerance

    PHASE 5 — End-to-End Encryption

    1.Key generation (client)
    2.Key exchange
    3.AES message encryption
    4.Secure message flow

    PHASE 6 — Frontend (WhatsApp-Like)

    1.Auth pages
    2.Chat UI
    3.WebSocket client
    4.Client-side crypto

    PHASE 7 — DevOps & Deployment

    1.Dockerfiles
    2.Docker Compose
    3.GitHub Actions CI/CD
    4.Cloud deployment

    PHASE 8 — Documentation

    1.Architecture docs
    2.Security docs
    3.API docs
    4.Resume-ready README

      chatsphere-backend/
      ├── src/
      │   ├── main/
      │   │   ├── java/
      │   │   │   └── com/
      │   │   │       └── chatsphere/
      │   │   │           ├── ChatSphereApplication.java
      │   │   │           │
      │   │   │           ├── config/
      │   │   │           │   ├── AppConfig.java
      │   │   │           │   ├── MongoConfig.java
      │   │   │           │   ├── WebSocketConfig.java
      │   │   │           │   └── RateLimitConfig.java
      │   │   │           │
      │   │   │           ├── security/
      │   │   │           │   ├── SecurityConfig.java
      │   │   │           │   ├── JwtAuthenticationFilter.java
      │   │   │           │   ├── JwtTokenProvider.java
      │   │   │           │   └── CustomUserDetailsService.java
      │   │   │           │
      │   │   │           ├── auth/
      │   │   │           │   ├── AuthController.java
      │   │   │           │   ├── AuthService.java
      │   │   │           │   └── dto/
      │   │   │           │       ├── LoginRequest.java
      │   │   │           │       ├── SignupRequest.java
      │   │   │           │       └── AuthResponse.java
      │   │   │           │
      │   │   │           ├── websocket/
      │   │   │           │   ├── ChatWebSocketHandler.java
      │   │   │           │   ├── WebSocketAuthInterceptor.java
      │   │   │           │   └── WebSocketSessionManager.java
      │   │   │           │
      │   │   │           ├── chat/
      │   │   │           │   ├── ChatController.java
      │   │   │           │   ├── ChatService.java
      │   │   │           │   └── MessageService.java
      │   │   │           │
      │   │   │           ├── presence/
      │   │   │           │   ├── PresenceService.java
      │   │   │           │   └── PresenceListener.java
      │   │   │           │
      │   │   │           ├── crypto/
      │   │   │           │   ├── KeyService.java
      │   │   │           │   ├── EncryptionService.java
      │   │   │           │   └── DecryptionService.java
      │   │   │           │
      │   │   │           ├── model/
      │   │   │           │   ├── User.java
      │   │   │           │   ├── Chat.java
      │   │   │           │   └── Message.java
      │   │   │           │
      │   │   │           └── repository/
      │   │   │               ├── UserRepository.java
      │   │   │               ├── ChatRepository.java
      │   │   │               └── MessageRepository.java
      │   │   │
      │   │   └── resources/
      │   │       └── application.yml
      │   │
      │   └── test/
      │
      ├── pom.xml
      ├── Dockerfile
      └── README.md


      chatsphere-frontend/
      ├── public/
      │   └── favicon.svg
      │
      ├── src/
      │   ├── main.jsx
      │   ├── App.jsx
      │   │
      │   ├── assets/
      │   │   ├── icons/
      │   │   └── images/
      │   │
      │   ├── api/
      │   │   ├── axiosClient.js
      │   │   ├── authApi.js
      │   │   └── chatApi.js
      │   │
      │   ├── auth/
      │   │   ├── Login.jsx
      │   │   ├── Signup.jsx
      │   │   └── ProtectedRoute.jsx
      │   │
      │   ├── components/
      │   │   ├── layout/
      │   │   │   ├── Sidebar.jsx
      │   │   │   ├── ChatLayout.jsx
      │   │   │   └── Header.jsx
      │   │   │
      │   │   ├── chat/
      │   │   │   ├── ChatWindow.jsx
      │   │   │   ├── MessageList.jsx
      │   │   │   ├── MessageBubble.jsx
      │   │   │   ├── MessageInput.jsx
      │   │   │   └── TypingIndicator.jsx
      │   │   │
      │   │   └── common/
      │   │       ├── Button.jsx
      │   │       ├── Loader.jsx
      │   │       └── Avatar.jsx
      │   │
      │   ├── context/
      │   │   ├── AuthContext.jsx
      │   │   ├── SocketContext.jsx
      │   │   └── ChatContext.jsx
      │   │
      │   ├── websocket/
      │   │   ├── socketClient.js
      │   │   └── socketEvents.js
      │   │
      │   ├── crypto/
      │   │   ├── keyGenerator.js
      │   │   ├── encryptMessage.js
      │   │   └── decryptMessage.js
      │   │
      │   ├── hooks/
      │   │   ├── useAuth.js
      │   │   ├── useSocket.js
      │   │   └── useChat.js
      │   │
      │   ├── utils/
      │   │   ├── constants.js
      │   │   ├── validators.js
      │   │   └── storage.js
      │   │
      │   └── styles/
      │       ├── global.css
      │       ├── chat.css
      │       └── theme.css
      │
      ├── index.html
      ├── package.json
      ├── vite.config.js
      ├── Dockerfile
      └── README.md

    Docker
    FROM node:20-alpine
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    RUN npm run build
    CMD ["npm", "run", "preview"]
