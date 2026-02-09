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
      className={`message-container ${own ? "own" : "other"}`}
    >
      <motion.div
        className={`message-bubble ${own ? "bubble-own" : "bubble-other"}`}
        layout
      >
        {/* Reply Context */}
        {replyToId && (
          <div className="reply-preview">
            <span className="reply-bar" />
            <span className="reply-text">Replying to message...</span>
          </div>
        )}

        {/* Media Content */}
        {message.type === "IMAGE" && (
          <motion.img
            src={message.mediaUrl}
            alt="attachment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="message-media"
            onClick={() => window.open(message.mediaUrl, '_blank')}
          />
        )}

        {/* Text Content */}
        {text && <div className="message-text">{text}</div>}

        {/* Metadata */}
        <div className="message-meta">
          <span className="timestamp">{formatTime(timestamp)}</span>
          {pending && <span className="status-pending">⏳</span>}
        </div>

        {/* Reactions */}
        <AnimatePresence>
          {Object.keys(reactions).length > 0 && (
            <motion.div
              className={`reactions-display ${own ? "left" : "right"}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              {Object.values(reactions).slice(0, 3).map((emoji, i) => (
                <span key={i}>{emoji}</span>
              ))}
              {Object.keys(reactions).length > 3 && (
                <span className="reaction-count">+{Object.keys(reactions).length - 3}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Actions */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            className={`message-actions ${own ? "left-actions" : "right-actions"}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button onClick={() => setShowPicker(!showPicker)} title="React">😊</button>
            <button onClick={() => setReplyingTo(message)} title="Reply">↩️</button>
            <button onClick={() => setForwardingMessage(message)} title="Forward">➡️</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Picker */}
      {showPicker && (
        <div className="emoji-picker-popover">
          <div className="picker-overlay" onClick={() => setShowPicker(false)} />
          <CustomEmojiPicker onEmojiClick={handleReactionClick} />
        </div>
      )}

      <style>{`
        .message-container {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
          position: relative;
          max-width: 100%;
        }

        .message-container.own {
          align-items: flex-end;
        }

        .message-container.other {
          align-items: flex-start;
        }

        .message-bubble {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 18px;
          position: relative;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          word-wrap: break-word;
        }

        .bubble-own {
          background: linear-gradient(135deg, var(--color-primary), #2d8cf0);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .bubble-other {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          border-bottom-left-radius: 4px; /* fixed typo own/other logic */
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .reply-preview {
          margin-bottom: 8px;
          padding: 4px 8px;
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
        }

        .reply-bar {
          width: 3px;
          height: 100%;
          background: currentColor;
          margin-right: 8px;
          border-radius: 2px;
          opacity: 0.5;
        }

        .message-media {
          max-width: 100%;
          border-radius: 12px;
          margin-bottom: 8px;
          cursor: pointer;
        }

        .message-text {
          line-height: 1.5;
        }

        .message-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          font-size: 0.7rem;
          opacity: 0.7;
          justify-content: flex-end;
        }

        .reactions-display {
          position: absolute;
          bottom: -10px;
          background: var(--bg-secondary);
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 0.8rem;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          display: flex;
          gap: 2px;
          border: 1px solid var(--border-color);
          z-index: 2;
        }
        
        .reactions-display.left { left: 10px; }
        .reactions-display.right { right: 10px; }

        .message-actions {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          gap: 6px;
          background: var(--glass-bg);
          padding: 4px;
          border-radius: 20px;
          backdrop-filter: blur(8px);
          border: 1px solid var(--glass-border);
          z-index: 5;
        }

        .left-actions { right: 100%; margin-right: 10px; }
        .right-actions { left: 100%; margin-left: 10px; }

        .message-actions button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          font-size: 1rem;
          transition: background 0.2s;
        }

        .message-actions button:hover {
          background: rgba(255,255,255,0.2);
        }

        .emoji-picker-popover {
          position: absolute;
          bottom: 100%;
          right: 0;
          z-index: 100;
        }
        
        .picker-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 99;
        }
      `}</style>
    </motion.div>
  );
}
