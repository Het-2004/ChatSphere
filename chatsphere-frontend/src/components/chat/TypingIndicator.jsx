import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "../../hooks/useChat";

export default function TypingIndicator() {
  const { typingUsers, activeChatId } = useChat();
  const usersTyping = typingUsers?.[activeChatId];

  const isTyping = usersTyping &&
    (Array.isArray(usersTyping)
      ? usersTyping.length > 0
      : Object.keys(usersTyping).length > 0);

  return (
    <AnimatePresence>
      {isTyping && (
        <motion.div
          className="typing-row"
          initial={{ opacity: 0, y: 10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: 10, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="typing-bubble">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
