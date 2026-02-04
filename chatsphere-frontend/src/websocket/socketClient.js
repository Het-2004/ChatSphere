export const connectSocket = (token) => {
  return new WebSocket(`ws://localhost:4040/ws/chat?token=${token}`);
};
