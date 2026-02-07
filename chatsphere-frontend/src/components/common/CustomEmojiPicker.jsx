import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const emojiCategories = {
    "Smileys": ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙"],
    "Gestures": ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👏", "🙌", "👐", "🤲", "🤝", "🙏"],
    "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
    "Animals": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦"],
    "Food": ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑", "🍆", "🥔"],
    "Activities": ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳"],
};

export default function CustomEmojiPicker({ onEmojiClick, onClose }) {
    const [activeCategory, setActiveCategory] = useState("Smileys");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredEmojis = searchQuery
        ? Object.values(emojiCategories).flat().filter(() => true) // Simple filter, could be enhanced
        : emojiCategories[activeCategory];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                left: 0,
                width: "360px",
                maxHeight: "400px",
                background: "var(--glass-bg)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid var(--glass-border)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-xl)",
                padding: "var(--spacing-md)",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
                <h3 style={{ margin: 0, fontSize: "1rem", color: "var(--text-primary)" }}>Pick an Emoji</h3>
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "transparent",
                        border: "1px solid var(--border-color)",
                        color: "var(--text-primary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                    }}
                >
                    ×
                </motion.button>
            </div>

            {/* Search */}
            <motion.input
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                type="text"
                placeholder="Search emojis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                    width: "100%",
                    padding: "var(--spacing-sm)",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text-primary)",
                    fontSize: "0.875rem",
                    marginBottom: "var(--spacing-md)",
                }}
            />

            {/* Categories */}
            {!searchQuery && (
                <div style={{ display: "flex", gap: "var(--spacing-xs)", marginBottom: "var(--spacing-md)", overflowX: "auto" }}>
                    {Object.keys(emojiCategories).map((category, index) => (
                        <motion.button
                            key={category}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveCategory(category)}
                            style={{
                                padding: "var(--spacing-xs) var(--spacing-md)",
                                background: activeCategory === category ? "var(--color-primary)" : "var(--bg-tertiary)",
                                border: "none",
                                borderRadius: "var(--radius-full)",
                                color: activeCategory === category ? "#ffffff" : "var(--text-primary)",
                                fontSize: "0.75rem",
                                fontWeight: activeCategory === category ? "600" : "400",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                transition: "all var(--transition-base)",
                            }}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Emoji Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(8, 1fr)",
                    gap: "var(--spacing-xs)",
                    overflowY: "auto",
                    maxHeight: "240px",
                    padding: "var(--spacing-xs)",
                }}
            >
                <AnimatePresence mode="wait">
                    {filteredEmojis.map((emoji, index) => (
                        <motion.button
                            key={`${emoji}-${index}`}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ delay: index * 0.01 }}
                            whileHover={{ scale: 1.3, zIndex: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                onEmojiClick({ emoji });
                                onClose();
                            }}
                            style={{
                                width: "36px",
                                height: "36px",
                                background: "transparent",
                                border: "1px solid transparent",
                                borderRadius: "var(--radius-sm)",
                                fontSize: "1.5rem",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all var(--transition-fast)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "var(--glass-bg)";
                                e.currentTarget.style.borderColor = "var(--color-primary)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.borderColor = "transparent";
                            }}
                        >
                            {emoji}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                    marginTop: "var(--spacing-md)",
                    paddingTop: "var(--spacing-md)",
                    borderTop: "1px solid var(--border-color)",
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    textAlign: "center",
                }}
            >
                Click an emoji to react
            </motion.div>
        </motion.div>
    );
}
