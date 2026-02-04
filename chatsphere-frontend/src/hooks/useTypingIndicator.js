import { useSocket } from "./useSocket";
import { useChat } from "./useChat";
import { SOCKET_EVENTS } from "../websocket/socketEvents";
import { sendEvent } from "../websocket/socketClient";

let typingTimeout;

export const useTypingIndicator = () => {
  const socket = useSocket();
  const { activeChatId } = useChat();

  const startTyping = () => {
    if (!socket || !activeChatId) return;

    sendEvent(socket, SOCKET_EVENTS.TYPING_START, {
      chatId: activeChatId
    });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(stopTyping, 2000);
  };

  const stopTyping = () => {
    if (!socket || !activeChatId) return;

    sendEvent(socket, SOCKET_EVENTS.TYPING_STOP, {
      chatId: activeChatId
    });
  };

  return { startTyping, stopTyping };
};
