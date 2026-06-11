import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import MessageSearch from "./MessageSearch";
import Header from "../layout/Header";
import ForwardMessageModal from "./ForwardMessageModal";
import UserProfileModal from "../modals/UserProfileModal";
import { useChat } from "../../hooks/useChat";
import { loadKey } from "../../crypto/keyStorage";

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

export default function ChatWindow() {
  const { activeChatId, messages } = useChat();
  const [aesKey, setAesKey] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!activeChatId) { setAesKey(null); return; }
    loadKey(`chat_${activeChatId}_aes`, "AES").then(setAesKey);
  }, [activeChatId]);

  const handleMessageSelect = (message) => {
    const el = document.getElementById(`msg-${message.id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("highlight-message");
      setTimeout(() => el.classList.remove("highlight-message"), 2000);
    }
  };

  if (!activeChatId) {
    return (
      <div className="chat-window">
        <motion.div
          className="chat-empty-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="chat-empty-icon"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          >
            <ChatIcon />
          </motion.div>

          <div className="chat-empty-title">ChatSphere</div>
          <div className="chat-empty-sub">
            Select a conversation from the left to start messaging, or search for someone new.
          </div>

          <div className="chat-empty-e2ee">
            <LockIcon />
            End-to-end encrypted
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <Header
        onUserClick={(u) => { setSelectedUser(u); setShowUserProfile(true); }}
        onSearchClick={() => setShowSearch(s => !s)}
      />

      {showSearch && (
        <div className="chat-search-bar">
          <MessageSearch messages={messages} onMessageSelect={handleMessageSelect} />
          <button
            style={{
              background: "none", border: "none", color: "var(--text-2)",
              cursor: "pointer", padding: "4px 8px", borderRadius: "50%",
              fontSize: "0.9rem",
            }}
            onClick={() => setShowSearch(false)}
          >✕</button>
        </div>
      )}

      <MessageList />
      <TypingIndicator />
      <MessageInput aesKey={aesKey} />
      <ForwardMessageModal />

      {showUserProfile && selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setShowUserProfile(false)}
        />
      )}
    </div>
  );
}
