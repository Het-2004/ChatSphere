import { useChat } from "../../hooks/useChat";

export default function TypingIndicator() {
  const { typingUsers, activeChatId } = useChat();
  const usersTyping = typingUsers[activeChatId];

  if (!usersTyping || usersTyping.length === 0) return null;

  return (
    <div className="typing-indicator">
      {usersTyping.join(", ")} typing…
    </div>
  );
}
