import { formatTime } from "../../utils/time";

import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useMessageSender } from "../../hooks/useMessageSender";
import { useChat } from "../../hooks/useChat";

export default function MessageBubble({ message }) {
  const { id, text, own, timestamp, pending, reactions = {}, replyToId } = message;
  const { sendReaction } = useMessageSender();
  const { setReplyingTo, setForwardingMessage } = useChat();

  const [showPicker, setShowPicker] = useState(false);

  const handleReactionClick = (emojiData) => {
    sendReaction(id, emojiData.emoji);
    setShowPicker(false);
  };

  return (
    <div className={`message-bubble-container ${own ? "own" : "other"}`}>
      <div className={`message-bubble ${own ? "own" : "other"}`}>
        {replyToId && <div className="reply-indicator">Replying to message...</div>}

        {/* Media Rendering */}
        {message.type === "IMAGE" && (
          <img src={message.mediaUrl} alt="attachment" className="bubble-image" />
        )}
        {message.type === "VIDEO" && (
          <video src={message.mediaUrl} controls className="bubble-video" />
        )}
        {(message.type === "AUDIO" || (message.mediaUrl && message.type === "AUDIO")) && (
          <audio controls src={message.mediaUrl} className="bubble-audio" />
        )}

        {/* Text Rendering (Caption or Message) */}
        {message.text && message.type !== "AUDIO" && <div className="bubble-text">{text}</div>}

        <div className="bubble-meta">
          {timestamp && <span>{formatTime(timestamp)}</span>}
          {pending && <span className="pending">⏳</span>}
        </div>

        {/* Reactions Display */}
        {Object.keys(reactions).length > 0 && (
          <div className="reactions-display">
            {Object.entries(reactions).map(([userId, emoji], idx) => (
              <span key={idx} className="reaction-emoji">{emoji}</span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {!pending && (
          <div className="bubble-actions">
            <button
              className="action-btn"
              onClick={() => setShowPicker(!showPicker)}
              title="React"
            >
              😊
            </button>
            <button
              className="action-btn"
              onClick={() => setReplyingTo(message)}
              title="Reply"
            >
              ↩️
            </button>
            <button
              className="action-btn"
              onClick={() => setForwardingMessage(message)} // Helper from useChat
              title="Forward"
            >
              ➡️
            </button>
          </div>
        )}
      </div>

      {showPicker && (
        <div className="emoji-picker-popover">
          <div className="overlay" onClick={() => setShowPicker(false)} />
          <EmojiPicker onEmojiClick={handleReactionClick} width={300} height={400} />
        </div>
      )}
    </div>
  );
}
