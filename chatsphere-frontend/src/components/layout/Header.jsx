import { motion } from "framer-motion";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import { formatLastSeen } from "../../utils/dateUtils";
import ThemeSwitcher from "./ThemeSwitcher";
import { buttonVariants } from "../animations/variants";

export default function Header() {
  const { chats, activeChatId, recordingUsers, typingUsers } = useChat();
  const { logout } = useAuth();

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

  return (
    <motion.header
      className="chat-header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--spacing-lg)",
        height: "var(--header-height)",
        borderBottom: "1px solid var(--border-color)",
        background: "var(--glass-bg)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-md)",
        }}
      >
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#ffffff",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {activeChat.name?.[0]?.toUpperCase() || "?"}
        </motion.div>

        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "var(--text-primary)",
            }}
          >
            {activeChat.name}
          </h2>
          <motion.div
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-xs)",
            }}
            animate={{
              opacity: isTyping || isRecording ? [1, 0.5, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: isTyping || isRecording ? Infinity : 0,
            }}
          >
            {activeChat.online && (
              <motion.span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--color-success)",
                  display: "inline-block",
                  boxShadow: "0 0 8px var(--color-success)",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            )}
            {statusText}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-md)",
        }}
      >
        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Logout Button */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={logout}
          style={{
            padding: "var(--spacing-sm) var(--spacing-lg)",
            background: "var(--glass-bg)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-md)",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all var(--transition-base)",
          }}
        >
          Logout
        </motion.button>
      </motion.div>
    </motion.header>
  );
}
