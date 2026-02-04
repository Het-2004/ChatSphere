import Sidebar from "./Sidebar";
import ChatWindow from "../chat/ChatWindow";

export default function ChatLayout() {
  return (
    <div className="chat-layout">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}
