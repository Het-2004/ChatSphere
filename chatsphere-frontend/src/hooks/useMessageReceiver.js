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
  const { addMessage, updateMessage, setRecordingUsers } = useChat(); // Added setRecordingUsers

  useEffect(() => {
    if (!socket || !aesKey) return;

    registerMessageHandler(socket, {
      [SOCKET_EVENTS.RECEIVE_MESSAGE]: (payload) => {
        // payload is the Message object
        // The decryption logic has been removed as per the provided snippet.
        // It's assumed the payload now contains the plaintext message directly.
        addMessage(payload.chatId, {
          ...payload,
          pending: false
        });
      },
      "MESSAGE_UPDATED": (payload) => {
        updateMessage(payload.chatId, payload.id, (prevMsg) => ({
          ...prevMsg,
          ...payload
        }));
      },
      "RECORDING_START": ({ chatId, userId }) => {
        setRecordingUsers((prev) => ({
          ...prev,
          [chatId]: { ...(prev[chatId] || {}), [userId]: true }
        }));
      },
      "RECORDING_STOP": ({ chatId, userId }) => {
        setRecordingUsers((prev) => {
          const chatUsers = { ...(prev[chatId] || {}) };
          delete chatUsers[userId];
          return { ...prev, [chatId]: chatUsers };
        });
      },
      // The partial TYPING_START handler from the snippet is not included
      // as it was incomplete and not directly related to the instruction
      // "Add MESSAGE_UPDATED handler" in the context of this file.
    });
  }, [socket, aesKey, addMessage, updateMessage]); // Added updateMessage to dependencies
};
