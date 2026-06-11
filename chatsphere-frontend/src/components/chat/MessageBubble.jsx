import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { formatTime } from "../../utils/time";
import { useMessageSender } from "../../hooks/useMessageSender";
import { useChat } from "../../hooks/useChat";
import CustomEmojiPicker from "../common/CustomEmojiPicker";

// Double tick SVG (WhatsApp-style)
const DoubleTick = ({ read }) => (
  <svg
    width="14"
    height="10"
    viewBox="0 0 16 11"
    fill="none"
    style={{ display: "inline-flex" }}
  >
    <path
      d="M1 5.5L5 9.5L15 1.5"
      stroke={read ? "var(--c-primary)" : "var(--text-2)"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 5.5L9 9.5"
      stroke={read ? "var(--c-primary)" : "var(--text-2)"}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const ReplyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
  </svg>
);

const ForwardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/>
  </svg>
);

const EmojiIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
  </svg>
);

const bubbleVariants = {
  initial: { opacity: 0, scale: 0.92, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 28 } },
};

export default function MessageBubble({ message, suppressTail }) {
  const { id, text, own, timestamp, pending, reactions = {}, replyToId } = message;
  const { sendReaction } = useMessageSender();
  const { setReplyingTo, setForwardingMessage } = useChat();

  const [showPicker, setShowPicker] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleReaction = (emojiData) => {
    sendReaction(id, emojiData.emoji);
    setShowPicker(false);
  };

  const reactionEntries = Object.entries(reactions);

  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      className={`msg-row ${own ? "out" : "in"} ${suppressTail ? "tail-suppress" : ""}`}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => { setShowActions(false); if (showPicker) setShowPicker(false); }}
      style={{ position: "relative" }}
      id={`msg-${id}`}
    >
      {/* Hover actions */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            className="msg-actions-wrap"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.12 }}
          >
            <button className="msg-action-btn" onClick={() => setShowPicker(p => !p)} title="React">
              <EmojiIcon />
            </button>
            <button className="msg-action-btn" onClick={() => setReplyingTo(message)} title="Reply">
              <ReplyIcon />
            </button>
            <button className="msg-action-btn" onClick={() => setForwardingMessage(message)} title="Forward">
              <ForwardIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji picker */}
      <AnimatePresence>
        {showPicker && (
          <>
            <div
              style={{ position: "fixed", inset: 0, zIndex: 99 }}
              onClick={() => setShowPicker(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                [own ? "right" : "left"]: 0,
                zIndex: 100,
              }}
            >
              <CustomEmojiPicker onEmojiClick={handleReaction} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bubble */}
      <div className={`msg-bubble ${own ? "out" : "in"}`}>
        {/* Reply preview */}
        {replyToId && (
          <div className="reply-preview-bubble">
            <div className="reply-author">Replied message</div>
            <div className="reply-text">…</div>
          </div>
        )}

        {/* Media */}
        {message.type === "IMAGE" && (
          <motion.img
            src={message.mediaUrl}
            alt="attachment"
            className="msg-media"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => window.open(message.mediaUrl, "_blank")}
          />
        )}

        {/* Audio message */}
        {message.type === "AUDIO" && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "2px 0",
          }}>
            <span style={{ fontSize: "1.2rem" }}>🎤</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.8rem", opacity: 0.85, marginBottom: "4px" }}>Voice Message</div>
              <div style={{
                height: "4px",
                background: own ? "rgba(255,255,255,0.3)" : "var(--bg-elevated)",
                borderRadius: "2px",
              }}>
                <div style={{
                  width: "60%",
                  height: "100%",
                  background: own ? "rgba(255,255,255,0.8)" : "var(--c-primary)",
                  borderRadius: "2px",
                }} />
              </div>
            </div>
          </div>
        )}

        {/* Text */}
        {text && <div className="msg-text">{text}</div>}

        {/* Footer */}
        <div className="msg-footer">
          <span className="msg-time">{formatTime(timestamp)}</span>
          {own && (
            <span className="msg-tick">
              {pending ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              ) : (
                <DoubleTick read={false} />
              )}
            </span>
          )}
        </div>

        {/* Reactions */}
        {reactionEntries.length > 0 && (
          <div className="msg-reactions">
            {reactionEntries.slice(0, 5).map(([key, emoji]) => (
              <motion.span
                key={key}
                className="reaction-chip"
                whileTap={{ scale: 0.9 }}
                onClick={() => sendReaction(id, emoji)}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
