import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { chats, activeChatId } = useChat();
  const { logout } = useAuth();

  const activeChat = chats.find((c) => c.id === activeChatId);

  if (!activeChat) return null;

  return (
    <header className="chat-header">
      <div className="chat-header-left">
        <div className="chat-avatar large">
          {activeChat.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <div className="chat-title">{activeChat.name}</div>
          <div className="chat-status">
            {activeChat.online ? "online" : "offline"}
          </div>
        </div>
      </div>

      <div className="chat-header-right">
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
}
