package com.chatsphere.websocket;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.chatsphere.chat.MessageService;
import com.chatsphere.model.Message;
import com.chatsphere.presence.PresenceService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final WebSocketSessionManager sessionManager;
    private final MessageService messageService;
    private final PresenceService presenceService;
    private final com.chatsphere.chat.ChatService chatService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /* ================= CONNECT ================= */

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = (String) session.getAttributes().get("userId");

        if (userId != null) {
            sessionManager.register(userId, session);
            presenceService.markOnline(userId);
            
            // Broadcast presence to all user's chats
            try {
                broadcastPresence(userId, true, null);
            } catch (Exception e) {
                // log error
            }
        }
    }
    
    private void broadcastPresence(String userId, boolean online, java.time.LocalDateTime lastSeen) {
         try {
             java.util.List<com.chatsphere.model.Chat> userChats = chatService.getUserChats(userId);
             
             Map<String, Object> payload = new HashMap<>();
             payload.put("userId", userId);
             payload.put("online", online);
             if (lastSeen != null) payload.put("lastSeen", lastSeen.toString());
             
             Map<String, Object> message = new HashMap<>();
             message.put("type", "PRESENCE_UPDATE");
             message.put("payload", payload);
             
             for (com.chatsphere.model.Chat chat : userChats) {
                 broadcastToChat(chat.getId(), message, userId);
             }
         } catch (Exception e) {
             e.printStackTrace();
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
        } else if ("ADD_REACTION".equals(type)) {
            handleReaction(session, root.get("payload"));
        } else if ("RECORDING_START".equals(type) || "RECORDING_STOP".equals(type)) {
            handleRecordingEvent(session, type, root.get("payload"));
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
        
        if (payload.has("type")) {
            try {
                message.setType(com.chatsphere.model.MessageType.valueOf(payload.get("type").asText()));
            } catch (Exception e) {
                message.setType(com.chatsphere.model.MessageType.TEXT);
            }
        }
        
        if (payload.has("mediaUrl")) {
            message.setMediaUrl(payload.get("mediaUrl").asText());
        }

        if (payload.has("replyToId")) {
            message.setReplyToId(payload.get("replyToId").asText());
        }

        if (payload.has("forwarded")) {
            message.setForwarded(payload.get("forwarded").asBoolean());
        }

        if (payload.has("originalSenderId")) {
            message.setOriginalSenderId(payload.get("originalSenderId").asText());
        }

        Message savedMessage = messageService.saveMessage(message);

        Map<String, Object> response = new HashMap<>();
        response.put("type", "RECEIVE_MESSAGE");
        response.put("payload", savedMessage);

        broadcastToChat(chatId, response, null); // Broadcast to all, including sender for confirmation
    }

    private void handleReaction(WebSocketSession session, JsonNode payload) throws Exception {
        String userId = (String) session.getAttributes().get("userId");
        if (userId == null) return;
        
        String messageId = payload.get("messageId").asText();
        String emoji = payload.get("emoji").asText();
        String chatId = payload.get("chatId").asText();
        
        Message updatedMessage = messageService.addReaction(messageId, userId, emoji);
        
        Map<String, Object> response = new HashMap<>();
        response.put("type", "MESSAGE_UPDATED");
        response.put("payload", updatedMessage);
        
        broadcastToChat(chatId, response, null);
    }

    private void handleRecordingEvent(WebSocketSession session, String type, JsonNode payload) throws Exception {
        String userId = (String) session.getAttributes().get("userId");
        if (userId == null) return;

        String chatId = payload.get("chatId").asText();

        Map<String, Object> response = new HashMap<>();
        response.put("type", type);
        response.put("payload", Map.of("chatId", chatId, "userId", userId));

        broadcastToChat(chatId, response, userId); // Exclude sender
    }

    private void broadcastToChat(String chatId, Object payload, String excludeUserId) throws Exception {
        java.util.Set<String> participants = chatService.getChatParticipants(chatId);
        String jsonPayload = objectMapper.writeValueAsString(payload);
        TextMessage message = new TextMessage(jsonPayload);

        for (String userId : participants) {
            if (userId.equals(excludeUserId)) continue;

            WebSocketSession userSession = sessionManager.getSession(userId);
            if (userSession != null && userSession.isOpen()) {
                userSession.sendMessage(message);
            }
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
