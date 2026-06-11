import { Platform } from 'react-native';

const WS_BASE_URL = Platform.OS === 'android' 
  ? 'ws://10.0.2.2:4040/ws/chat' 
  : 'ws://localhost:4040/ws/chat';

let socket = null;
let reconnectTimer = null;

export const connectSocket = (token, onMessage, onConnect, onDisconnect) => {
  if (socket) {
    socket.close();
  }

  const query = `token=${token}`;
  const url = `${WS_BASE_URL}?${query}`;

  console.log('[WS] Connecting to:', url);
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('[WS] Connected successfully');
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (onConnect) onConnect();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onMessage) onMessage(data);
    } catch (e) {
      console.warn('[WS] Failed to parse message:', event.data);
    }
  };

  socket.onclose = (event) => {
    console.warn('[WS] Closed:', event.code, event.reason);
    if (onDisconnect) onDisconnect();
    
    // Auto reconnect every 5 seconds
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        console.log('[WS] Reconnecting...');
        connectSocket(token, onMessage, onConnect, onDisconnect);
      }, 5000);
    }
  };

  socket.onerror = (error) => {
    console.error('[WS] Error:', error.message);
  };

  return socket;
};

export const sendEvent = (type, payload = {}) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type,
        payload,
        timestamp: Date.now(),
      })
    );
  } else {
    console.warn('[WS] Socket not open. Cannot send event:', type);
  }
};

export const disconnectSocket = () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (socket) {
    socket.close();
    socket = null;
  }
};
