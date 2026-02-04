import Sidebar from "./Sidebar";
import ChatWindow from "../chat/ChatWindow";
import { ChatProvider } from "../../context/ChatContext";
import { SocketProvider } from "../../context/SocketContext";

/**
 * Top-level chat layout
 * Wraps chat & socket contexts
 */
export default function ChatLayout() {
  return (
    <SocketProvider>
      <ChatProvider>
        <div className="app-layout">
          <Sidebar />
          <ChatWindow />
        </div>
      </ChatProvider>
    </SocketProvider>
  );
}
