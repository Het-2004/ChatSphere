import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow() {
  return (
    <div className="chat-window">
      <MessageList />
      <MessageInput />
    </div>
  );
}
