import { useSocket } from "./useSocket";
import { useChat } from "./useChat";
import { encryptMessage } from "../crypto/encryptMessage";
import { SOCKET_EVENTS } from "../websocket/socketEvents";
import { sendEvent } from "../websocket/socketClient";

/**
 * Handles sending encrypted messages
 */
export const useMessageSender = (aesKey) => {
  const socket = useSocket();
  const { activeChatId, addMessage } = useChat();

  const sendMessage = async (plaintext) => {
    if (!socket || !activeChatId || !plaintext.trim()) return;

    // Encrypt before sending
    const encryptedPayload = await encryptMessage(aesKey, plaintext);

    // Optimistic UI update
    addMessage(activeChatId, {
      text: plaintext,
      own: true,
      pending: true
    });

    // Send ciphertext to backend
    sendEvent(socket, SOCKET_EVENTS.SEND_MESSAGE, {
      chatId: activeChatId,
      payload: encryptedPayload
    });
  };

  return { sendMessage };
};
