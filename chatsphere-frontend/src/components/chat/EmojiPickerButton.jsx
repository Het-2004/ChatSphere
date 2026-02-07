import { useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";

export default function EmojiPickerButton({ onEmojiSelect }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    onEmojiSelect(emojiData.emoji);
    setShowPicker(false);
  };

  return (
    <div className="emoji-picker-wrapper" ref={pickerRef}>
      <button
        type="button"
        className="emoji-btn"
        onClick={() => setShowPicker(!showPicker)}
        title="Add emoji"
      >
        😊
      </button>

      {showPicker && (
        <div className="emoji-picker-popup">
          <div className="emoji-overlay" onClick={() => setShowPicker(false)} />
          <div className="emoji-picker-container">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={350}
              height={450}
              searchPlaceholder="Search emoji..."
              previewConfig={{ showPreview: false }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
