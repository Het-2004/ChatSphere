import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import Header from "../layout/Header";
import { useChat } from "../../hooks/useChat";

export default function ChatWindow() {
  const { activeChatId } = useChat();

  if (!activeChatId) {
    return (
      <div className="chat-window empty">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <Header />
      <MessageList />
      <TypingIndicator />
      <MessageInput />
    </div>
  );
}
