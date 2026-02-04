import { formatTime } from "../../utils/time";

export default function MessageBubble({ message }) {
  const { text, own, timestamp, pending } = message;

  return (
    <div className={`message-bubble ${own ? "own" : "other"}`}>
      <div className="bubble-text">{text}</div>

      <div className="bubble-meta">
        {timestamp && <span>{formatTime(timestamp)}</span>}
        {pending && <span className="pending">⏳</span>}
      </div>
    </div>
  );
}
