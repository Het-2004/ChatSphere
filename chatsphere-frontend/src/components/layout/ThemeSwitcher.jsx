import { useTheme, THEMES } from "../../context/ThemeContext";
import { motion } from "framer-motion";

// Theme color swatches for the buttons
const THEME_COLORS = {
  whatsapp:  { bg: "#00a884", label: "WhatsApp" },
  telegram:  { bg: "#3390ec", label: "Telegram" },
  cyberpunk: { bg: "#00f3ff", label: "Cyberpunk" },
  sunset:    { bg: "#ff6b6b", label: "Sunset" },
  ocean:     { bg: "#00d4ff", label: "Ocean" },
  forest:    { bg: "#10b981", label: "Forest" },
};

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: "5px" }}
      title="Switch theme"
    >
      {Object.entries(THEME_COLORS).map(([key, { bg, label }]) => (
        <motion.button
          key={key}
          title={label}
          onClick={() => setTheme(key)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: theme === key ? 22 : 18,
            height: theme === key ? 22 : 18,
            borderRadius: "50%",
            background: bg,
            border: theme === key ? "2px solid white" : "2px solid transparent",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: theme === key ? `0 0 0 1px ${bg}` : "none",
            outline: "none",
          }}
        />
      ))}
    </div>
  );
}
