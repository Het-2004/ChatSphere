import { createContext, useEffect, useRef, useContext } from "react";
import { connectSocket, registerMessageHandler } from "../websocket/socketClient";
import { useAuth } from "../hooks/useAuth";
import { ChatContext } from "./ChatContext";
import { loadKey } from "../crypto/keyStorage";
import { decryptMessage } from "../crypto/decryptMessage";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const { token } = useAuth();
  const chatContext = useContext(ChatContext);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        console.log("[SocketProvider] Token removed, closing socket");
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    // Close existing connection if any
    if (socketRef.current) {
      socketRef.current.close();
    }

    console.log("[SocketProvider] Attempting to connect WebSocket...");

    // Create socket connection (JWT-authenticated)
    socketRef.current = connectSocket(token);

    socketRef.current.onopen = () => {
      console.log("[SocketProvider] WebSocket connected successfully");
    };

    socketRef.current.onclose = (event) => {
      console.log(`[SocketProvider] WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
    };

    socketRef.current.onerror = (err) => {
      console.error("[SocketProvider] WebSocket error:", err);
    };

    // Register message handlers if chat context is available
    if (chatContext) {
      registerMessageHandler(socketRef.current, {
        RECEIVE_MESSAGE: async (payload) => {
          console.log("[Socket] Received message:", payload);
          if (payload.chatId) {
            let messageToDisplay = { ...payload };
            try {
              if (payload.encryptedPayload) {
                const keyName = `chat_${payload.chatId}_aes`;
                const aesKey = await loadKey(keyName, "AES");
                if (aesKey) {
                  const encryptedData = JSON.parse(payload.encryptedPayload);
                  const decryptedText = await decryptMessage(aesKey, encryptedData);
                  messageToDisplay.text = decryptedText;
                } else {
                  console.warn("[Socket] No AES key found for chat: " + payload.chatId);
                  messageToDisplay.text = "[Decryption key missing]";
                }
              }
            } catch (err) {
              console.error("[Socket] Failed to decrypt incoming message:", err);
              messageToDisplay.text = "[Decryption failed]";
              messageToDisplay.error = true;
            }

            chatContext.addMessage(payload.chatId, messageToDisplay);

            // Add notification if not viewing this chat
            if (chatContext.activeChatId !== payload.chatId) {
              chatContext.addNotification(payload.chatId);
            }
          }
        },

        MESSAGE_UPDATED: (payload) => {
          console.log("[Socket] Message updated:", payload);
          if (payload.chatId && payload.id) {
            chatContext.updateMessage(payload.chatId, payload.id, () => payload);
          }
        },

        PRESENCE_UPDATE: (payload) => {
          console.log("[Socket] Presence update:", payload);
          if (payload.userId) {
            if (payload.online) {
              chatContext.setUserOnline(payload.userId);
            } else {
              chatContext.setUserOffline(payload.userId);
            }
          }
        },

        TYPING_START: (payload) => {
          console.log("[Socket] Typing start:", payload);
          if (payload.chatId && payload.userId) {
            chatContext.setTypingUsers(prev => ({
              ...prev,
              [payload.chatId]: { ...(prev[payload.chatId] || {}), [payload.userId]: true }
            }));
          }
        },

        TYPING_STOP: (payload) => {
          console.log("[Socket] Typing stop:", payload);
          if (payload.chatId && payload.userId) {
            chatContext.setTypingUsers(prev => ({
              ...prev,
              [payload.chatId]: { ...(prev[payload.chatId] || {}), [payload.userId]: false }
            }));
          }
        },

        RECORDING_START: (payload) => {
          console.log("[Socket] Recording start:", payload);
          if (payload.chatId && payload.userId) {
            chatContext.setRecordingUsers(prev => ({
              ...prev,
              [payload.chatId]: { ...(prev[payload.chatId] || {}), [payload.userId]: true }
            }));
          }
        },

        RECORDING_STOP: (payload) => {
          console.log("[Socket] Recording stop:", payload);
          if (payload.chatId && payload.userId) {
            chatContext.setRecordingUsers(prev => ({
              ...prev,
              [payload.chatId]: { ...(prev[payload.chatId] || {}), [payload.userId]: false }
            }));
          }
        }
      });
    }

    // Cleanup on unmount or token change
    return () => {
      if (socketRef.current) {
        console.log("[SocketProvider] Cleaning up WebSocket connection");
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [token, chatContext]);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
};
