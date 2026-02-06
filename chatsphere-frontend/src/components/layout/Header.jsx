import { useTheme } from "../../context/ThemeContext";

export default function Header() {
  const { chats, activeChatId, recordingUsers, typingUsers } = useChat();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const activeChat = chats.find((c) => c.id === activeChatId);

  if (!activeChat) return null;

  // Check if anyone is recording in this chat
  const isRecording = recordingUsers[activeChatId] && Object.keys(recordingUsers[activeChatId]).length > 0;

  // Check typing
  const isTyping = typingUsers[activeChatId] && Object.keys(typingUsers[activeChatId]).length > 0;

  let statusText = activeChat.online ? "online" : "offline";
  if (!activeChat.online && activeChat.lastSeen) {
    statusText = `last seen ${formatLastSeen(activeChat.lastSeen)}`;
  }

  if (isRecording) statusText = "🎤 recording audio...";
  else if (isTyping) statusText = "typing...";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="chat-header">
      <div className="chat-header-left">
        <div className="chat-info">
          <h2 className="chat-title">{activeChat.name}</h2>
          <div className="chat-status">
            {statusText}
          </div>
        </div>
      </div>

      <div className="chat-header-right">
        <button onClick={toggleTheme} className="theme-btn" title="Toggle Theme" style={{ marginRight: "10px" }}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </header >
  );
}
