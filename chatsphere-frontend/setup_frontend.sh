#!/bin/bash

# Define the base directory
BASE_DIR="chatsphere-frontend/src"

# 1. Create directory structure (only if they don't exist)
echo "Creating frontend directory structure..."
mkdir -p "$BASE_DIR/api"
mkdir -p "$BASE_DIR/components"
mkdir -p "$BASE_DIR/context"
mkdir -p "$BASE_DIR/crypto"
mkdir -p "$BASE_DIR/pages"
mkdir -p "$BASE_DIR/utils"

# 2. Function to create file only if it doesn't exist
create_file() {
    if [ ! -f "$1" ]; then
        touch "$1"
        echo "Created: $1"
    else
        echo "Skipping (already exists): $1"
    fi
}

# 3. Create Files
# API files
create_file "$BASE_DIR/api/authApi.js"
create_file "$BASE_DIR/api/chatApi.js"

# Components
create_file "$BASE_DIR/components/ChatWindow.jsx"
create_file "$BASE_DIR/components/MessageBubble.jsx"
create_file "$BASE_DIR/components/Sidebar.jsx"

# Context (State Management)
create_file "$BASE_DIR/context/AuthContext.jsx"
create_file "$BASE_DIR/context/SocketContext.jsx"

# Crypto (Security Layer)
create_file "$BASE_DIR/crypto/encrypt.js"
create_file "$BASE_DIR/crypto/decrypt.js"

# Pages
create_file "$BASE_DIR/pages/Login.jsx"
create_file "$BASE_DIR/pages/Chat.jsx"

# Utils
create_file "$BASE_DIR/utils/websocket.js"

# Root Level
create_file "chatsphere-frontend/package.json"

echo "✅ Frontend structure is ready!"
