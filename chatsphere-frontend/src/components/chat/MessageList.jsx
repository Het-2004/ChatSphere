import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import { useChat } from "../../hooks/useChat";

const getDateLabel = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const isSameSender = (a, b) => a?.own === b?.own;

export default function MessageList() {
  const { activeChatId, messagesByChat } = useChat();
  const messages = messagesByChat?.[activeChatId] || [];
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="message-list" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: "center", color: "var(--text-3)", padding: "2rem" }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>👋</div>
          <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-2)", marginBottom: "6px" }}>
            No messages yet
          </div>
          <div style={{ fontSize: "0.83rem", color: "var(--text-3)", lineHeight: 1.6 }}>
            Say hi to start the conversation!
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="message-list">
      <AnimatePresence initial={false}>
        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          const nextMsg = messages[index + 1];

          const isNewDay =
            !prevMsg ||
            new Date(msg.timestamp).toDateString() !==
              new Date(prevMsg.timestamp).toDateString();

          // Suppress tail if next message is from same sender (group consecutive)
          const suppressTail = nextMsg && isSameSender(msg, nextMsg);

          return (
            <motion.div
              key={msg.id || index}
              initial={false}
              layout
            >
              {isNewDay && (
                <div className="date-divider">
                  <span>{getDateLabel(msg.timestamp)}</span>
                </div>
              )}
              <MessageBubble message={msg} suppressTail={suppressTail} />
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
