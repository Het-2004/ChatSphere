import { createContext, useMemo, useState, useCallback, useEffect } from "react";
import { getMessagesApi } from "../api/chatApi";
import { loadKey } from "../crypto/keyStorage";
import { decryptMessage } from "../crypto/decryptMessage";

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messagesByChat, setMessagesByChat] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [recordingUsers, setRecordingUsers] = useState({});
  const [forwardingMessage, setForwardingMessage] = useState(null);

  // Missing states that components expect
  const [notifications, setNotifications] = useState({}); // { chatId: unreadCount }
  const [onlineUsers, setOnlineUsers] = useState(new Set()); // Set of online user IDs
  const [loadingMessages, setLoadingMessages] = useState({}); // { chatId: boolean }

  // Computed: messages for active chat (convenience accessor)
  const messages = messagesByChat[activeChatId] || [];

  const setMessagesForChat = useCallback((chatId, messages) => {
    setMessagesByChat((prev) => ({
      ...prev,
      [chatId]: messages
    }));
  }, []);

  const addMessage = useCallback((chatId, message) => {
    setMessagesByChat((prev) => {
      const current = prev[chatId] || [];

      // Attempt to deduplicate/reconcile with pending messages
      // If the new message is NOT pending (i.e. from server)
      if (!message.pending) {
        // Find a pending message that matches the content and type
        // We search from the end as it's likely recent
        for (let i = current.length - 1; i >= 0; i--) {
          const existing = current[i];
          if (existing.pending &&
            existing.text === message.text &&
            existing.type === message.type) {

            // Found a match! Replace pending with real message
            const updated = [...current];
            updated[i] = message;
            return {
              ...prev,
              [chatId]: updated
            };
          }
        }
      }

      // Check for exact ID duplicate (just in case)
      if (message.id && current.some(m => m.id === message.id)) {
        return prev;
      }

      return {
        ...prev,
        [chatId]: [...current, message]
      };
    });
  }, []);

  const updateMessage = useCallback((chatId, messageId, updater) => {
    setMessagesByChat((prev) => {
      const chatMessages = prev[chatId] || [];
      const updatedMessages = chatMessages.map((msg) =>
        msg.id === messageId ? updater(msg) : msg
      );
      return { ...prev, [chatId]: updatedMessages };
    });
  }, []);

  // Sync onlineUsers list with initial loaded chats online status
  useEffect(() => {
    if (!chats || chats.length === 0) return;
    const initialOnline = new Set();
    chats.forEach(chat => {
      chat.participants?.forEach(p => {
        if (p.online) {
          initialOnline.add(p.id);
        }
      });
    });
    setOnlineUsers(prev => {
      const merged = new Set(prev);
      initialOnline.forEach(id => merged.add(id));
      return merged;
    });
  }, [chats]);

  // Load historical messages when a chat is opened
  useEffect(() => {
    if (!activeChatId) return;

    // Skip if already loaded or currently loading
    if (messagesByChat[activeChatId]?.length > 0 || loadingMessages[activeChatId]) {
      console.log(`[ChatContext] Skipping message load for chat ${activeChatId}:`, {
        alreadyLoaded: messagesByChat[activeChatId]?.length > 0,
        currentlyLoading: loadingMessages[activeChatId],
        messageCount: messagesByChat[activeChatId]?.length || 0
      });
      return;
    }

    const loadMessages = async () => {
      console.log(`[ChatContext] 📥 Starting to load messages for chat: ${activeChatId}`);
      setLoadingMessages(prev => ({ ...prev, [activeChatId]: true }));

      try {
        // Fetch encrypted messages from backend
        console.log(`[ChatContext] 🌐 Fetching messages from API: GET /api/messages/${activeChatId}`);
        const encryptedMessages = await getMessagesApi(activeChatId);

        console.log(`[ChatContext] ✅ API Response received:`, {
          chatId: activeChatId,
          messageCount: encryptedMessages.length,
          statusCode: '200 OK'
        });

        if (encryptedMessages.length === 0) {
          console.log(`[ChatContext] ℹ️ No messages found for chat ${activeChatId}`);
          setLoadingMessages(prev => ({ ...prev, [activeChatId]: false }));
          return;
        }

        // Log sample of encrypted message structure
        console.log(`[ChatContext] 📦 Sample encrypted message:`, {
          id: encryptedMessages[0].id,
          senderId: encryptedMessages[0].senderId,
          hasEncryptedPayload: !!encryptedMessages[0].encryptedPayload,
          payloadLength: encryptedMessages[0].encryptedPayload?.length,
          timestamp: encryptedMessages[0].timestamp
        });

        // Load AES key for this chat
        const keyName = `chat_${activeChatId}_aes`;
        console.log(`[ChatContext] 🔑 Loading AES key from IndexedDB: ${keyName}`);
        const aesKey = await loadKey(keyName, "AES");

        if (!aesKey) {
          console.warn(`[ChatContext] ⚠️ No AES key found for chat: ${activeChatId}`);
          console.warn(`[ChatContext] 💡 Check IndexedDB for key: ${keyName}`);
          console.warn(`[ChatContext] 💡 This usually means the chat was created before encryption was set up`);
          setLoadingMessages(prev => ({ ...prev, [activeChatId]: false }));
          return;
        }

        console.log(`[ChatContext] ✅ AES key loaded successfully for chat ${activeChatId}`);

        // Decrypt all messages
        console.log(`[ChatContext] 🔓 Starting decryption of ${encryptedMessages.length} messages...`);
        const decryptedMessages = await Promise.all(
          encryptedMessages.map(async (msg, index) => {
            try {
              // Parse the encrypted payload (it's a JSON string)
              const payload = JSON.parse(msg.encryptedPayload);

              // Decrypt the message
              const decryptedText = await decryptMessage(aesKey, payload);

              if (index === 0) {
                console.log(`[ChatContext] ✅ First message decrypted successfully:`, {
                  id: msg.id,
                  textPreview: decryptedText.substring(0, 50) + (decryptedText.length > 50 ? '...' : ''),
                  textLength: decryptedText.length
                });
              }

              // Return the message in the format expected by the UI
              return {
                id: msg.id,
                senderId: msg.senderId,
                text: decryptedText,
                timestamp: msg.timestamp,
                type: msg.type || 'TEXT',
                mediaUrl: msg.mediaUrl,
                reactions: msg.reactions || {},
                replyToId: msg.replyToId,
                forwarded: msg.forwarded || false,
                originalSenderId: msg.originalSenderId,
                pending: false // Historical messages are never pending
              };
            } catch (err) {
              console.error(`[ChatContext] ❌ Failed to decrypt message:`, {
                messageId: msg.id,
                error: err.message,
                stack: err.stack
              });
              // Return a placeholder for failed decryption
              return {
                id: msg.id,
                senderId: msg.senderId,
                text: "[Decryption failed]",
                timestamp: msg.timestamp,
                type: 'TEXT',
                pending: false,
                error: true
              };
            }
          })
        );

        console.log(`[ChatContext] ✅ Decryption complete:`, {
          totalMessages: decryptedMessages.length,
          successfulDecryptions: decryptedMessages.filter(m => !m.error).length,
          failedDecryptions: decryptedMessages.filter(m => m.error).length
        });

        // Set the decrypted messages for this chat
        console.log(`[ChatContext] 💾 Setting ${decryptedMessages.length} messages for chat ${activeChatId}`);
        setMessagesForChat(activeChatId, decryptedMessages);

        console.log(`[ChatContext] 🎉 Message loading complete for chat ${activeChatId}`);
      } catch (error) {
        console.error(`[ChatContext] ❌ Failed to load messages for chat: ${activeChatId}`, {
          error: error.message,
          stack: error.stack,
          response: error.response?.data,
          status: error.response?.status
        });
      } finally {
        setLoadingMessages(prev => ({ ...prev, [activeChatId]: false }));
      }
    };

    loadMessages();
  }, [activeChatId, messagesByChat, loadingMessages, setMessagesForChat]);

  // Notification helpers
  const addNotification = useCallback((chatId) => {
    setNotifications((prev) => ({
      ...prev,
      [chatId]: (prev[chatId] || 0) + 1
    }));
  }, []);

  const clearNotification = useCallback((chatId) => {
    setNotifications((prev) => ({
      ...prev,
      [chatId]: 0
    }));
  }, []);

  // Online users helpers
  const setUserOnline = useCallback((userId) => {
    setOnlineUsers((prev) => new Set([...prev, userId]));
  }, []);

  const setUserOffline = useCallback((userId) => {
    setOnlineUsers((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      // Chat list
      chats,
      setChats,
      activeChatId,
      setActiveChatId,

      // Messages
      messagesByChat,
      messages, // Convenience accessor for active chat
      setMessagesForChat,
      addMessage,
      updateMessage,

      // Typing
      typingUsers,
      setTypingUsers,

      // Reply
      replyingTo,
      setReplyingTo,

      // Recording
      recordingUsers,
      setRecordingUsers,

      // Forward
      forwardingMessage,
      setForwardingMessage,

      // Notifications
      notifications,
      addNotification,
      clearNotification,

      // Online presence
      onlineUsers,
      setOnlineUsers,
      setUserOnline,
      setUserOffline
    }),
    [chats, activeChatId, messagesByChat, messages, typingUsers, replyingTo,
      recordingUsers, forwardingMessage, notifications, onlineUsers,
      setMessagesForChat, addMessage, updateMessage, addNotification,
      clearNotification, setUserOnline, setUserOffline]
  );

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
