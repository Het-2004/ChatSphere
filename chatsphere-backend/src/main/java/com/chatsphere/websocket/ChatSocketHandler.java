// File: src/main/java/com/chatsphere/websocket/ChatSocketHandler.java
package com.chatsphere.websocket;

import com.chatsphere.service.ChatService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class ChatSocketHandler extends TextWebSocketHandler {

    private final ChatService chatService;
    private final ObjectMapper objectMapper;
    
    // Thread-safe map to manage active user sessions
    private static final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        // 1. Log the incoming message metadata (security auditing)
        // 2. Parse payload to MessageRequest
        // 3. chatService.saveAndForward(parsedMessage);
        
        // Example: Broadcast logic or specific user routing
        System.out.println("Message received: " + payload);
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = (String) session.getAttributes().get("userId");
        if (userId != null) {
            sessions.put(userId, session);
        }
    }
}