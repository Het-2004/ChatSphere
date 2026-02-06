import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { useChat } from "../../hooks/useChat";

export default function MessageList() {
  const { activeChatId, messagesByChat } = useChat();
  const messages = messagesByChat[activeChatId] || [];
  const bottomRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <MessageBubble key={msg.id || index} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
