# ChatSphere – System Architecture

## Overview
ChatSphere is a secure real-time messaging platform inspired by WhatsApp and Telegram.

## High-Level Architecture
Frontend (React)
→ Backend (Spring Boot)
→ MongoDB, Redis, Message Queue

## Components
- Auth Service (JWT)
- WebSocket Chat Service
- Presence Service
- Encryption Layer (E2EE)

## Data Flow
1. User logs in → JWT issued
2. WebSocket connects using JWT
3. Messages encrypted on client
4. Encrypted messages routed via backend
