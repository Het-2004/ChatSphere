import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { useChat } from "./useChat";
import { decryptMessage } from "../crypto/decryptMessage";
import { SOCKET_EVENTS } from "../websocket/socketEvents";
import { registerMessageHandler } from "../websocket/socketClient";

/**
 * Handles receiving encrypted messages
 */
export const useMessageReceiver = (aesKey) => {
  const socket = useSocket();
  const { addMessage } = useChat();

  useEffect(() => {
    if (!socket || !aesKey) return;

    registerMessageHandler(socket, {
      [SOCKET_EVENTS.RECEIVE_MESSAGE]: async (payload) => {
        const plaintext = await decryptMessage(aesKey, payload.encrypted);

        addMessage(payload.chatId, {
          text: plaintext,
          own: false
        });
      }
    });
  }, [socket, aesKey, addMessage]);
};
