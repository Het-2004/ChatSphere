import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import { formatLastSeen } from "../../utils/dateUtils";
import ThemeSwitcher from "./ThemeSwitcher";

const BackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const VideoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.77a16 16 0 0 0 6.29 6.29l1.13-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
  </svg>
);

export default function Header({ onUserClick }) {
  const { chats, activeChatId, setActiveChatId, recordingUsers, typingUsers, onlineUsers } = useChat();
  const { user } = useAuth();

  const activeChat = chats.find(c => c.id === activeChatId);
  if (!activeChat) return null;

  const isRecording = recordingUsers?.[activeChatId] && Object.keys(recordingUsers[activeChatId]).length > 0;
  const isTyping = typingUsers?.[activeChatId] && Object.keys(typingUsers[activeChatId]).length > 0;

  const other = !activeChat.isGroup
    ? activeChat.participants?.find(p => p.id !== user?.id)
    : null;

  const isOnline = other && onlineUsers?.has?.(other.id);

  const getName = () => {
    if (activeChat.isGroup) return activeChat.name;
    return other?.username || other?.name || other?.email || activeChat.name || "Unknown";
  };

  const getAvatar = () => {
    const name = getName();
    if (!activeChat.isGroup && other?.avatarUrl) return other.avatarUrl;
    if (activeChat.isGroup && activeChat.avatarUrl) return activeChat.avatarUrl;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2a3942&color=e9edef&size=96`;
  };

  let statusText = "";
  if (isRecording) statusText = "🎤 Recording...";
  else if (isTyping) statusText = "typing...";
  else if (activeChat.isGroup) {
    const memberCount = activeChat.participants?.length || 0;
    statusText = `${memberCount} member${memberCount !== 1 ? "s" : ""}`;
  } else if (isOnline) {
    statusText = "online";
  } else if (other?.lastSeen) {
    statusText = `last seen ${formatLastSeen(other.lastSeen)}`;
  } else {
    statusText = "offline";
  }

  const statusClass = isTyping || isRecording
    ? "typing"
    : isOnline
    ? "online"
    : "";

  return (
    <motion.header
      className="chat-header"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Left: back + avatar + info */}
      <div className="chat-header-left">
        <button
          className="header-icon-btn back-btn"
          onClick={() => setActiveChatId(null)}
          title="Back"
        >
          <BackIcon />
        </button>

        <div
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
          onClick={() => onUserClick && onUserClick(activeChat)}
        >
          <div className="avatar-wrap" style={{ flexShrink: 0 }}>
            <img
              src={getAvatar()}
              alt={getName()}
              className="avatar-lg"
            />
            {isOnline && <span className="online-dot" style={{ borderColor: "var(--header-bg)" }} />}
          </div>

          <div className="chat-header-info">
            <div className="chat-header-name">{getName()}</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={statusText}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className={`chat-header-status ${statusClass}`}
              >
                {statusText}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right: actions */}
      <div className="chat-header-actions">
        <button className="header-icon-btn" title="Voice call">
          <PhoneIcon />
        </button>
        <button className="header-icon-btn" title="Video call">
          <VideoIcon />
        </button>
        <ThemeSwitcher />
        <button className="header-icon-btn" title="More options">
          <MoreIcon />
        </button>
      </div>
    </motion.header>
  );
}
