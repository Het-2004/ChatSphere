import { useState, useEffect } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import Header from "../layout/Header";
import ForwardMessageModal from "./ForwardMessageModal"; // Import Modal
import { useChat } from "../../hooks/useChat";
import { loadKey } from "../../crypto/keyStorage"; // Import loadKey

export default function ChatWindow() {
  const { activeChatId } = useChat();
  const [aesKey, setAesKey] = useState(null);

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

  if (!activeChatId) {
    return (
      <div className="chat-window empty">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <Header />
      <MessageList />
      <TypingIndicator />
      <MessageInput aesKey={aesKey} />
      <ForwardMessageModal />
    </div>
  );
}
