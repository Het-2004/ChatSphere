import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "../../hooks/useChat";
import { getChatsApi } from "../../api/chatApi";
import NewChatModal from "../modals/NewChatModal";
import UserStatus from "../common/UserStatus";
import { containerVariants, itemVariants, buttonVariants } from "../animations/variants";

// Ripple effect component
function RippleEffect({ x, y }) {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        background: "var(--color-primary)",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    />
  );
}

export default function Sidebar() {
  const { chats, setChats, activeChatId, setActiveChatId } = useChat();
  const [showNewChat, setShowNewChat] = useState(false);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    // Load chat list on mount
    const loadChats = async () => {
      try {
        const data = await getChatsApi();
        setChats(data);
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    };

    loadChats();
  }, [setChats]);

  const handleChatClick = (chatId, e) => {
    setActiveChatId(chatId);

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, ripple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 600);
  };

  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          padding: "var(--spacing-lg)",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--glass-bg)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: "700",
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Chats
        </h2>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => setShowNewChat(true)}
          title="New Chat"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            border: "none",
            color: "#ffffff",
            fontSize: "1.5rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-md)",
          }}
        >
          +
        </motion.button>
      </motion.div>

      {/* Chat List */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "var(--spacing-sm)",
        }}
      >
        <AnimatePresence>
          {chats.map((chat, index) => (
            <motion.div
              key={chat.id}
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              onClick={(e) => handleChatClick(chat.id, e)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-md)",
                padding: "var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                marginBottom: "var(--spacing-xs)",
                background: activeChatId === chat.id ? "var(--glass-bg)" : "transparent",
                border: activeChatId === chat.id ? "1px solid var(--color-primary)" : "1px solid transparent",
                position: "relative",
                overflow: "hidden",
                transition: "all var(--transition-base)",
                boxShadow: activeChatId === chat.id ? "var(--shadow-md)" : "none",
              }}
            >
              {/* Ripple effects */}
              <AnimatePresence>
                {ripples.map((ripple) => (
                  <RippleEffect key={ripple.id} x={ripple.x} y={ripple.y} />
                ))}
              </AnimatePresence>

              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#ffffff",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  {chat.name?.charAt(0).toUpperCase()}
                </div>
                <UserStatus userId={chat.id} />
              </motion.div>

              {/* Chat Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: activeChatId === chat.id ? "600" : "500",
                    color: "var(--text-primary)",
                    marginBottom: "var(--spacing-xs)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {chat.name}
                </div>

                {chat.lastMessage && (
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chat.lastMessage}
                  </div>
                )}
              </div>

              {/* Unread badge */}
              {chat.unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    minWidth: "24px",
                    height: "24px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-primary)",
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 var(--spacing-xs)",
                    boxShadow: "var(--glow-primary)",
                  }}
                >
                  {chat.unreadCount}
                </motion.div>
              )}

              {/* Active indicator */}
              {activeChatId === chat.id && (
                <motion.div
                  layoutId="activeChat"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "4px",
                    height: "60%",
                    background: "linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                    borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                    boxShadow: "var(--glow-primary)",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {chats.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              padding: "var(--spacing-xl)",
              color: "var(--text-secondary)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "var(--spacing-md)" }}>💬</div>
            <p style={{ margin: 0, fontSize: "0.875rem" }}>No chats yet</p>
            <p style={{ margin: "var(--spacing-xs) 0 0", fontSize: "0.75rem" }}>
              Click + to start a new chat
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} />}
      </AnimatePresence>
    </motion.aside>
  );
}
