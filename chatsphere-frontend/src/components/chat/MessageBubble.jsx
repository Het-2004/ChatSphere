import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { formatTime } from "../../utils/time";
import { useMessageSender } from "../../hooks/useMessageSender";
import { useChat } from "../../hooks/useChat";
import { messageBubbleVariants } from "../animations/variants";
import CustomEmojiPicker from "../common/CustomEmojiPicker";

export default function MessageBubble({ message }) {
  const { id, text, own, timestamp, pending, reactions = {}, replyToId } = message;
  const { sendReaction } = useMessageSender();
  const { setReplyingTo, setForwardingMessage } = useChat();

  const [showPicker, setShowPicker] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleReactionClick = (emojiData) => {
    sendReaction(id, emojiData.emoji);
    setShowPicker(false);
  };

  return (
    <motion.div
      variants={messageBubbleVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: own ? "flex-end" : "flex-start",
        marginBottom: "var(--spacing-md)",
        position: "relative",
      }}
    >
      <motion.div
        className={`message-bubble ${own ? "message-own" : "message-other"}`}
        style={{
          maxWidth: "70%",
          padding: "var(--spacing-md) var(--spacing-lg)",
          borderRadius: "var(--radius-lg)",
          background: own ? "var(--message-own-bg)" : "var(--message-other-bg)",
          color: own ? "var(--message-own-text)" : "var(--message-other-text)",
          wordWrap: "break-word",
          position: "relative",
          boxShadow: "var(--shadow-sm)",
          transform: own
            ? "perspective(1000px) rotateY(-1deg)"
            : "perspective(1000px) rotateY(1deg)",
          borderBottomRightRadius: own ? "var(--radius-sm)" : "var(--radius-lg)",
          borderBottomLeftRadius: own ? "var(--radius-lg)" : "var(--radius-sm)",
        }}
      >
        {/* Reply indicator */}
        {replyToId && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "var(--spacing-xs) var(--spacing-sm)",
              background: "rgba(0, 0, 0, 0.1)",
              borderRadius: "var(--radius-sm)",
              marginBottom: "var(--spacing-sm)",
              fontSize: "0.75rem",
              borderLeft: "3px solid var(--color-primary)",
            }}
          >
            Replying to message...
          </motion.div>
        )}

        {/* Media Rendering */}
        {message.type === "IMAGE" && (
          <motion.img
            src={message.mediaUrl}
            alt="attachment"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            style={{
              maxWidth: "100%",
              borderRadius: "var(--radius-md)",
              marginBottom: text ? "var(--spacing-sm)" : 0,
              cursor: "pointer",
            }}
          />
        )}
        {message.type === "VIDEO" && (
          <video
            src={message.mediaUrl}
            controls
            style={{
              maxWidth: "100%",
              borderRadius: "var(--radius-md)",
              marginBottom: text ? "var(--spacing-sm)" : 0,
            }}
          />
        )}
        {(message.type === "AUDIO" || (message.mediaUrl && message.type === "AUDIO")) && (
          <audio
            controls
            src={message.mediaUrl}
            style={{
              maxWidth: "100%",
              marginBottom: text ? "var(--spacing-sm)" : 0,
            }}
          />
        )}

        {/* Text Rendering */}
        {message.text && message.type !== "AUDIO" && (
          <div style={{ fontSize: "0.9375rem", lineHeight: "1.5" }}>{text}</div>
        )}

        {/* Timestamp and status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-xs)",
            marginTop: "var(--spacing-xs)",
            fontSize: "0.75rem",
            opacity: 0.7,
          }}
        >
          {timestamp && <span>{formatTime(timestamp)}</span>}
          {pending && (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              ⏳
            </motion.span>
          )}
        </div>

        {/* Reactions Display */}
        {Object.keys(reactions).length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: "absolute",
              bottom: "-12px",
              right: own ? "auto" : "var(--spacing-md)",
              left: own ? "var(--spacing-md)" : "auto",
              display: "flex",
              gap: "var(--spacing-xs)",
              background: "var(--bg-secondary)",
              padding: "var(--spacing-xs) var(--spacing-sm)",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {Object.entries(reactions).map(([userId, emoji], idx) => (
              <motion.span
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                style={{ fontSize: "1rem" }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              display: "flex",
              gap: "var(--spacing-xs)",
              marginTop: "var(--spacing-xs)",
              position: "relative",
            }}
          >
            {/* Reaction button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowPicker(!showPicker)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--glass-bg)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid var(--glass-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "1rem",
              }}
              title="React"
            >
              😊
            </motion.button>

            {/* Reply button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setReplyingTo(message)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--glass-bg)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid var(--glass-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "1rem",
              }}
              title="Reply"
            >
              ↩️
            </motion.button>

            {/* Forward button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setForwardingMessage(message)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--glass-bg)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid var(--glass-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "1rem",
              }}
              title="Forward"
            >
              ➡️
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showPicker && (
          <CustomEmojiPicker
            onEmojiClick={handleReactionClick}
            onClose={() => setShowPicker(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
