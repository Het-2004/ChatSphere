import { SOCKET_EVENTS } from "./socketEvents";

/**
 * Create a JWT-authenticated WebSocket connection
 * Backend MUST validate JWT during handshake
 */
export const connectSocket = (token) => {
  const WS_URL = `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws/chat`;

  const query = new URLSearchParams({ token }).toString();
  const socket = new WebSocket(`${WS_URL}?${query}`);

  socket.onopen = () => {
    console.log("[WS] Connected");
  };

  socket.onclose = (event) => {
    console.warn("[WS] Disconnected", event.reason);
  };

  socket.onerror = (error) => {
    console.error("[WS] Error", error);
  };

  return socket;
};

/**
 * Send an event safely over WebSocket
 */
export const sendEvent = (socket, type, payload = {}) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn("[WS] Cannot send, socket not open");
    return;
  }

  socket.send(
    JSON.stringify({
      type,
      payload,
      timestamp: Date.now()
    })
  );
};

/**
 * Register a message handler
 * All incoming messages go through here
 */
export const registerMessageHandler = (socket, handlers = {}) => {
  if (!socket) return;

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      const { type, payload } = message;

      if (handlers[type]) {
        handlers[type](payload);
      } else {
        console.warn("[WS] Unhandled event:", type);
      }
    } catch (err) {
      console.error("[WS] Invalid message format", err);
    }
  };
};
