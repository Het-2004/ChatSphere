import { createContext, useEffect, useRef } from "react";
import { connectSocket } from "../websocket/socketClient";
import { getToken } from "../utils/storage";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.warn("[SocketProvider] No token found, skipping WebSocket connection");
      return;
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
      console.error("[SocketProvider] Make sure the backend is running on https://localhost:4040");
    };

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        console.log("[SocketProvider] Cleaning up WebSocket connection");
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
};
