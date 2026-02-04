package com.chatsphere.presence;

import com.chatsphere.websocket.WebSocketSessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

/**
 * Listens to WebSocket connect/disconnect events
 * and updates user presence
 */
@Component
@RequiredArgsConstructor
public class PresenceListener {

    private final PresenceService presenceService;
    private final WebSocketSessionManager sessionManager;

    @EventListener
    public void handleWebSocketConnect(SessionConnectEvent event) {
        String sessionId = SimpMessageHeaderAccessor.getSessionId(event.getMessage().getHeaders());
        String userId = sessionManager.getUserId(sessionId);
        if (userId != null) {
            presenceService.markOnline(userId);
        }
    }

    @EventListener
    public void handleWebSocketDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        String userId = sessionManager.getUserId(sessionId);
        if (userId != null) {
            presenceService.markOffline(userId);
            sessionManager.removeSession(sessionId);
        }
    }
}
