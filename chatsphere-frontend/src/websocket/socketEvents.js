/**
 * WebSocket event names
 * Keep this file STRICTLY as constants
 * (prevents typos & protocol mismatch)
 */
export const SOCKET_EVENTS = Object.freeze({
  // Connection
  AUTH: "AUTH",

  // Messaging
  SEND_MESSAGE: "SEND_MESSAGE",
  RECEIVE_MESSAGE: "RECEIVE_MESSAGE",

  // Presence
  USER_ONLINE: "USER_ONLINE",
  USER_OFFLINE: "USER_OFFLINE",

  // Typing
  TYPING_START: "TYPING_START",
  TYPING_STOP: "TYPING_STOP",

  // Acknowledgements
  MESSAGE_DELIVERED: "MESSAGE_DELIVERED",
  MESSAGE_READ: "MESSAGE_READ",

  // Errors
  ERROR: "ERROR"
});
