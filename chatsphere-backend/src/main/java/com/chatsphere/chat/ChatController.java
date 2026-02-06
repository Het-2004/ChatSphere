package com.chatsphere.chat;

import com.chatsphere.model.Chat;
import com.chatsphere.model.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final MessageService messageService;

    /**
     * Get all chats for logged-in user
     * Used by Sidebar
     */
    @GetMapping("/chats")
    public ResponseEntity<List<Chat>> getChats(Authentication auth) {
        String userId = auth.getName();
        return ResponseEntity.ok(chatService.getUserChats(userId));
    }

    /**
     * Create or get 1-to-1 chat
     */
    @PostMapping("/chats")
    public ResponseEntity<Chat> createChat(
            Authentication auth,
            @RequestParam String userId
    ) {
        String me = auth.getName();
        return ResponseEntity.ok(chatService.createOrGetChat(me, userId));
    }

    /**
     * Get encrypted message history (pagination-ready)
     */
    @GetMapping("/messages/{chatId}")
    public ResponseEntity<List<Message>> getMessages(
            Authentication auth,
            @PathVariable String chatId
    ) {
        String userId = auth.getName();
        return ResponseEntity.ok(
                messageService.getMessages(chatId, userId)
        );
    }
    @PostMapping("/groups")
    public ResponseEntity<Chat> createGroup(
            Authentication auth,
            @RequestBody com.chatsphere.chat.dto.CreateGroupRequest request
    ) {
        String adminId = auth.getName();
        return ResponseEntity.ok(chatService.createGroup(adminId, request));
    }

    @PutMapping("/chats/{chatId}/members")
    public ResponseEntity<Chat> addMember(
            Authentication auth,
            @PathVariable String chatId,
            @RequestBody java.util.Map<String, String> body // { "userId": "..." }
    ) {
        String adminId = auth.getName();
        return ResponseEntity.ok(chatService.addGroupMember(adminId, chatId, body.get("userId")));
    }
}
