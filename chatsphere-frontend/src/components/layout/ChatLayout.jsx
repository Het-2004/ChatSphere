import Sidebar from "./Sidebar";
import ChatWindow from "../chat/ChatWindow";
import { ChatProvider } from "../../context/ChatContext";
import { SocketProvider } from "../../context/SocketContext";
import { useChat } from "../../hooks/useChat";

/**
 * Inner container to access ChatContext and manage mobile responsive classes
 */
function ChatContainer() {
  const { activeChatId } = useChat();

  return (
    <div className={`app-container ${activeChatId ? "chat-active" : "sidebar-active"}`}>
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

/**
 * Top-level chat layout
 * ChatProvider must wrap SocketProvider since socket handlers update chat state
 */
export default function ChatLayout() {
  return (
    <ChatProvider>
      <SocketProvider>
        <ChatContainer />
      </SocketProvider>
    </ChatProvider>
  );
}
