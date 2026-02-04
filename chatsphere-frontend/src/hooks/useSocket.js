import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

/**
 * Provides access to the SINGLE WebSocket instance
 */
export const useSocket = () => {
  const socketRef = useContext(SocketContext);

  if (!socketRef) {
    throw new Error("useSocket must be used within SocketProvider");
  }

  return socketRef.current;
};
