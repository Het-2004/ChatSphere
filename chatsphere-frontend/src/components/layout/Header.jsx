import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import { formatLastSeen } from "../../utils/dateUtils";
import ThemeSwitcher from "./ThemeSwitcher";
import { buttonVariants } from "../animations/variants";

export default function Header({ onUserClick }) {
  const { chats, activeChatId, recordingUsers, typingUsers } = useChat();
  const { logout } = useAuth();

  const activeChat = chats.find((c) => c.id === activeChatId);

  if (!activeChat) return null;

  // Check if anyone is recording in this chat
  const isRecording = recordingUsers[activeChatId] && Object.keys(recordingUsers[activeChatId]).length > 0;

  // Check typing
  const isTyping = typingUsers[activeChatId] && Object.keys(typingUsers[activeChatId]).length > 0;

  let statusText = activeChat.online ? "Online" : "Offline";
  if (!activeChat.online && activeChat.lastSeen) {
    statusText = `Last seen ${formatLastSeen(activeChat.lastSeen)}`;
  }

  // Override status text for activities
  if (isRecording) statusText = "🎤 Recording audio...";
  else if (isTyping) statusText = "Typing...";

  // Helper to get avatar
  const getAvatarUrl = () => {
    if (activeChat.isGroup) {
      return activeChat.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeChat.name)}`;
    }
    // For direct chats, find the other participant (though activeChat usually has name set properly by Sidebar logic or backend)
    // Assuming activeChat.name is correct from Sidebar processing
    return activeChat.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeChat.name)}`;
  };

  return (
    <motion.header
      className="chat-header glass-strong"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="header-left">
        <motion.div
          className="user-profile-trigger"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onUserClick && onUserClick(activeChat)}
        >
          <div className="avatar-container">
            <img
              src={getAvatarUrl()}
              alt={activeChat.name}
              className="header-avatar"
            />
            {activeChat.online && <span className="status-dot"></span>}
          </div>

          <div className="header-info">
            <h2 className="chat-title">{activeChat.name}</h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={statusText}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`chat-status ${activeChat.online ? 'online' : ''} ${isTyping || isRecording ? 'active-activity' : ''}`}
              >
                {statusText}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="header-right">
        <ThemeSwitcher />

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={logout}
          className="btn-icon-glass"
          title="Logout"
        >
          <span style={{ fontSize: '1.2rem' }}>🚪</span>
        </motion.button>
      </div>

      <style>{`
        .chat-header {
          height: 80px;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--glass-border);
          z-index: 10;
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        .user-profile-trigger {
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 12px;
          transition: background 0.2s;
        }

        .user-profile-trigger:hover {
          background: rgba(255,255,255,0.05);
        }

        .avatar-container {
          position: relative;
        }

        .header-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.1);
          object-fit: cover;
        }

        .status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: var(--color-success);
          border-radius: 50%;
          border: 2px solid var(--glass-bg); /* Match header bg */
          box-shadow: 0 0 5px var(--color-success);
        }

        .header-info {
          display: flex;
          flex-direction: column;
        }

        .chat-title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .chat-status {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .chat-status.online {
          color: var(--color-success);
        }

        .chat-status.active-activity {
          color: var(--color-primary);
          font-weight: 500;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn-icon-glass {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-icon-glass:hover {
          background: rgba(255,255,255,0.1);
          border-color: var(--color-primary);
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.1);
        }
      `}</style>
    </motion.header>
  );
}
