package com.chatsphere.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Manages active WebSocket sessions
 * userId <-> sessionId mapping
 */
@Component
public class WebSocketSessionManager {

    private final Map<String, String> sessionToUser = new ConcurrentHashMap<>();
    private final Map<String, WebSocketSession> userToSession = new ConcurrentHashMap<>();

    public void register(String userId, WebSocketSession session) {
        sessionToUser.put(session.getId(), userId);
        userToSession.put(userId, session);
    }

    public String removeSession(String sessionId) {
        String userId = sessionToUser.remove(sessionId);
        if (userId != null) {
            userToSession.remove(userId);
        }
        return userId;
    }

    public String getUserId(String sessionId) {
        return sessionToUser.get(sessionId);
    }

    public WebSocketSession getSession(String userId) {
        return userToSession.get(userId);
    }
}
