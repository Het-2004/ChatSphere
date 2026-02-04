# ChatSphere – Security Design

## Authentication
- JWT (stateless)
- Access tokens only
- No server-side sessions

## Transport Security
- HTTPS for REST APIs
- WSS for WebSocket communication

## Data Security
- Passwords hashed using BCrypt
- Messages are end-to-end encrypted
- Server never stores plaintext messages

## Protection Against Attacks
- Brute-force protection (rate limiting)
- Input validation
- XSS & CSRF prevention
