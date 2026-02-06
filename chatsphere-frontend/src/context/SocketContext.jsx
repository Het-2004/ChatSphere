import { createContext, useEffect, useRef } from "react";
import { connectSocket } from "../websocket/socketClient";
import { useAuth } from "../hooks/useAuth";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const { token } = useAuth(); // Use token from AuthContext

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        console.log("[SocketProvider] Token removed, closing socket");
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    // If socket already connected with same token (unlikely with this logic, but good safety), skip
    // Actually, we should close and reconnect if token changes.
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
      console.error("[SocketProvider] Check if backend is running and tokens are valid.");
    };

    // Cleanup on unmount or token change
    return () => {
      if (socketRef.current) {
        console.log("[SocketProvider] Cleaning up WebSocket connection");
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
};
