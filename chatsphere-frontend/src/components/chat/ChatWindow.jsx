import { useState, useEffect } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import MessageSearch from "./MessageSearch";
import Header from "../layout/Header";
import ForwardMessageModal from "./ForwardMessageModal";
import UserProfileModal from "../modals/UserProfileModal";
import { useChat } from "../../hooks/useChat";
import { loadKey } from "../../crypto/keyStorage";

export default function ChatWindow() {
  const { activeChatId, messages } = useChat();
  const [aesKey, setAesKey] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  useEffect(() => {
    if (!activeChatId) {
      setAesKey(null);
      return;
    }

    // Load key for active chat
    loadKey(`chat_${activeChatId}_aes`, "AES").then(key => {
      setAesKey(key);
    });
  }, [activeChatId]);

  const handleMessageSelect = (message) => {
    // Scroll to message (could implement smooth scroll here)
    const msgElement = document.getElementById(`msg-${message.id}`);
    if (msgElement) {
      msgElement.scrollIntoView({ behavior: "smooth", block: "center" });
      msgElement.classList.add("highlight-message");
      setTimeout(() => msgElement.classList.remove("highlight-message"), 2000);
    }
  };

  if (!activeChatId) {
    return (
      <div className="chat-window empty">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <Header onUserClick={(user) => {
        setSelectedUser(user);
        setShowUserProfile(true);
      }} />
      
      <div className="chat-tools">
        <MessageSearch
          messages={messages}
          onMessageSelect={handleMessageSelect}
        />
      </div>

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
