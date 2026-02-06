package com.chatsphere.websocket;

import com.chatsphere.chat.MessageService;
import com.chatsphere.model.Message;
import com.chatsphere.presence.PresenceService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final WebSocketSessionManager sessionManager;
    private final MessageService messageService;
    private final PresenceService presenceService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /* ================= CONNECT ================= */

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = (String) session.getAttributes().get("userId");

        if (userId != null) {
            sessionManager.register(userId, session);
            presenceService.markOnline(userId);
        }
    }

    /* ================= MESSAGE ================= */

    @Override
    protected void handleTextMessage(
            WebSocketSession session,
            TextMessage textMessage
    ) throws Exception {

        JsonNode root = objectMapper.readTree(textMessage.getPayload());

        if (!root.has("type") || !root.has("payload")) {
            return;
        }

        String type = root.get("type").asText();

        if ("SEND_MESSAGE".equals(type)) {
            handleSendMessage(session, root.get("payload"));
        }
    }

    private void handleSendMessage(
            WebSocketSession session,
            JsonNode payload
    ) throws Exception {

        String senderId = (String) session.getAttributes().get("userId");
        if (senderId == null) return;

        if (!payload.has("chatId") || !payload.has("payload")) return;

        String chatId = payload.get("chatId").asText();
        JsonNode encryptedPayloadNode = payload.get("payload");

        Message message = new Message();
        message.setChatId(chatId);
        message.setSenderId(senderId);
        message.setEncryptedPayload(encryptedPayloadNode.toString());

        Message savedMessage = messageService.saveMessage(message);

        Map<String, Object> response = new HashMap<>();
        response.put("type", "RECEIVE_MESSAGE");
        response.put("payload", savedMessage);

        TextMessage outgoing =
                new TextMessage(objectMapper.writeValueAsString(response));

        WebSocketSession senderSession =
                sessionManager.getSession(senderId);

        if (senderSession != null && senderSession.isOpen()) {
            senderSession.sendMessage(outgoing);
        }
    }

    /* ================= DISCONNECT ================= */

    @Override
    public void afterConnectionClosed(
            WebSocketSession session,
            CloseStatus status
    ) {
        try {
            String userId = sessionManager.removeSession(session.getId());
            if (userId != null) {
                presenceService.markOffline(userId);
            }
        } catch (Exception e) {
            // Ignore errors during shutdown
        }
    }
    
    @Override
    public void handleTransportError(
            WebSocketSession session,
            Throwable exception
    ) {
        try {
            String userId = sessionManager.removeSession(session.getId());
            if (userId != null) {
                presenceService.markOffline(userId);
            }
        } catch (Exception e) {
            // Ignore errors during cleanup
        }
    }
}
