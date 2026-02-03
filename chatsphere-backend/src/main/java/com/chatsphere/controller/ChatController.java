package com.chatsphere.controller;

import com.chatsphere.dto.MessageRequest;
import com.chatsphere.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // Send message (REST fallback, not WebSocket)
    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(
            @RequestBody MessageRequest request,
            Authentication authentication
    ) {
        String senderUsername = authentication.getName();
        chatService.saveMessage(senderUsername, request);
        return ResponseEntity.ok("Message saved");
    }
}
