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


PS D:\Project\ChatSphere\chatsphere-backend\src\main\resources> keytool -genkeypair -alias chatsphere -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore keystore.p12 -validity 365 -storepass changeit -keypass changeit
Enter the distinguished name. Provide a single dot (.) to leave a sub-component empty or press ENTER to use the default value in braces.
What is your first and last name?
  [Unknown]:  Het Solanki
What is the name of your organizational unit?
  [Unknown]:  What is the name of your organization?
  [Unknown]:  
PS D:\Project\ChatSphere\chatsphere-backend\src\main\resources> keytool -genkeypair -alias chatsphere -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore keystore.p12 -validity 365 -storepass changeit -keypass changeit
Enter the distinguished name. Provide a single dot (.) to leave a sub-component empty or press ENTER to use the default value in braces.
What is your first and last name?
  [Unknown]:  ChatSphere
What is the name of your organizational unit?
  [Unknown]:  Dev
What is the name of your organization?
  [Unknown]:  ChatSphere
What is the name of your City or Locality?
  [Unknown]:  Ahmedabad
  [Unknown]:  IN
Is CN=ChatSphere, OU=Dev, O=ChatSphere, L=Ahmedabad, ST=Gujarat, C=IN correct?
  [no]:  yes

Generating 2048-bit RSA key pair and self-signed certificate (SHA384withRSA) with a validity of 365 days   
        for: CN=ChatSphere, OU=Dev, O=ChatSphere, L=Ahmedabad, ST=Gujarat, C=IN

PS D:\Project\ChatSphere\chatsphere-backend\src\main\resources> keytool -list -keystore keystore.p12 -storepass changeit
Keystore type: PKCS12
Keystore provider: SUN

Your keystore contains 1 entry

chatsphere, 3 Feb 2026, PrivateKeyEntry,
Certificate fingerprint (SHA-256): 67:CC:6C:20:C9:4E:58:DB:B4:38:97:A7:EA:94:D0:3B:3E:38:5A:7B:6C:E8:62:F2:E6:0D:35:56:6C:7A:6B:E2

