import { useState } from "react";

const stickers = [
  { id: 1, emoji: "👍", name: "Thumbs Up" },
  { id: 2, emoji: "❤️", name: "Heart" },
  { id: 3, emoji: "😂", name: "Laughing" },
  { id: 4, emoji: "😍", name: "Love" },
  { id: 5, emoji: "🎉", name: "Party" },
  { id: 6, emoji: "🔥", name: "Fire" },
  { id: 7, emoji: "⭐", name: "Star" },
  { id: 8, emoji: "💯", name: "100" },
  { id: 9, emoji: "🚀", name: "Rocket" },
  { id: 10, emoji: "💪", name: "Strong" },
  { id: 11, emoji: "🎯", name: "Target" },
  { id: 12, emoji: "✨", name: "Sparkles" },
  { id: 13, emoji: "🌟", name: "Glowing Star" },
  { id: 14, emoji: "💡", name: "Idea" },
  { id: 15, emoji: "☕", name: "Coffee" },
  { id: 16, emoji: "🍕", name: "Pizza" },
  { id: 17, emoji: "🎮", name: "Gaming" },
  { id: 18, emoji: "🎵", name: "Music" },
  { id: 19, emoji: "📱", name: "Phone" },
  { id: 20, emoji: "💻", name: "Laptop" },
];

export default function StickerPicker({ onStickerSelect, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="sticker-picker-modal">
      <div className="sticker-overlay" onClick={onClose} />
      <div className="sticker-picker-content">
        <div className="sticker-header">
          <h3>Stickers</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="sticker-grid">
          {stickers.map((sticker) => (
            <button
              key={sticker.id}
              className="sticker-item"
              onClick={() => {
                onStickerSelect(sticker.emoji);
                onClose();
              }}
              title={sticker.name}
            >
              <span className="sticker-emoji">{sticker.emoji}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
