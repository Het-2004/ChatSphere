import { useSocket } from "./useSocket";
import { useChat } from "./useChat";
import { encryptMessage } from "../crypto/encryptMessage";
import { SOCKET_EVENTS } from "../websocket/socketEvents";
import { sendEvent } from "../websocket/socketClient";
import { loadKey } from "../crypto/keyStorage";

/**
 * Handles sending encrypted messages
 */
export const useMessageSender = (aesKey) => {
  const socket = useSocket();
  const { activeChatId, addMessage } = useChat();



  // ...

  const sendMessage = async (plaintext, type = "TEXT", mediaUrl = null, replyToId = null, targetChatId = null, forwarded = false, originalSenderId = null) => {
    let finalChatId = targetChatId || activeChatId;
    if (!socket || !finalChatId) return;
    if (type === "TEXT" && !plaintext.trim()) return;

    // Determine encryption key
    let finalKey = aesKey;
    if (targetChatId && targetChatId !== activeChatId) {
      // We need to load the key for the target chat
      // Assuming key is stored as "chat_${chatId}_aes" or similar.
      // If we don't know the scheme, we might fail. 
      // Let's assume a convention or try to load a global key if one exists?
      // Note: For this task, we assume keys are available or we use a fallback mechanism.
      // Let's try to load standard key name.
      finalKey = await loadKey(`chat_${targetChatId}_aes`, "AES");
      if (!finalKey) {
        // Fallback: maybe we use the same key (if global)?
        // Or we just send unencrypted for now if key not found (bad for security but unstucks us)?
        // Let's alert error.
        console.error("No key found for target chat");
        return;
      }
    }

    // Encrypt before sending (encrypt text or a placeholder for audio)
    // For audio, we can encrypt the transcript or just "Voice Message"
    const contentToEncrypt = plaintext || (type === "AUDIO" ? "🎤 Voice Message" : "");
    const encryptedPayload = await encryptMessage(finalKey, contentToEncrypt);

    // Optimistic UI update (only if sending to current chat)
    if (finalChatId === activeChatId) {
      addMessage(activeChatId, {
        text: contentToEncrypt,
        own: true,
        pending: true,
        type,
        mediaUrl
      });
    }

    // Send ciphertext to backend
    sendEvent(socket, SOCKET_EVENTS.SEND_MESSAGE, {
      chatId: finalChatId,
      payload: encryptedPayload,
      type,
      mediaUrl,
      replyToId: forwarded ? null : replyToId, // Don't reply if forwarding (unless desired)
      forwarded,
      originalSenderId
    });
  };

  const sendReaction = (messageId, emoji) => {
    if (!socket || !activeChatId) return;

    // Optimistic Update
    // We need to update the message in the context immediately
    // usage: updateMessage(activeChatId, messageId, (msg) => ({ ...msg, reactions: { ...msg.reactions, [myUserId]: emoji } }))
    // But we don't have myUserId here easily without decoding token or from context.
    // For now, rely on backend echo for the update (since we implemented MESSAGE_UPDATED)

    sendEvent(socket, "ADD_REACTION", {
      chatId: activeChatId,
      messageId,
      emoji
    });
  };

  const sendRecordingStatus = (isRecording) => {
    if (!socket || !activeChatId) return;

    sendEvent(socket, isRecording ? "RECORDING_START" : "RECORDING_STOP", {
      chatId: activeChatId
    });
  };

  return { sendMessage, sendReaction, sendRecordingStatus };
};
