import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTheme, THEMES } from "../../context/ThemeContext";

const themeIcons = {
    [THEMES.CYBERPUNK]: "🌐",
    [THEMES.SUNSET]: "🌅",
    [THEMES.OCEAN]: "🌊",
    [THEMES.FOREST]: "🌲",
};

const themeNames = {
    [THEMES.CYBERPUNK]: "Cyberpunk",
    [THEMES.SUNSET]: "Sunset",
    [THEMES.OCEAN]: "Ocean",
    [THEMES.FOREST]: "Forest",
};

export default function ThemeSwitcher() {
    const { theme, setTheme, themes } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        setIsOpen(false);
    };

    return (
        <div style={{ position: "relative" }}>
            {/* Theme button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "var(--glass-bg)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid var(--glass-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    boxShadow: "var(--shadow-md)",
                    transition: "all var(--transition-base)",
                }}
                title="Change Theme"
            >
                {themeIcons[theme]}
            </motion.button>

            {/* Theme dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 999,
                            }}
                        />

                        {/* Dropdown menu */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -10 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            style={{
                                position: "absolute",
                                top: "calc(100% + 8px)",
                                right: 0,
                                background: "var(--glass-bg)",
                                backdropFilter: "blur(20px)",
                                WebkitBackdropFilter: "blur(20px)",
                                border: "1px solid var(--glass-border)",
                                borderRadius: "var(--radius-lg)",
                                boxShadow: "var(--shadow-xl)",
                                padding: "var(--spacing-sm)",
                                minWidth: "200px",
                                zIndex: 1000,
                            }}
                        >
                            <div style={{ padding: "var(--spacing-sm)", borderBottom: "1px solid var(--border-color)", marginBottom: "var(--spacing-sm)" }}>
                                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.05em" }}>
                                    Select Theme
                                </p>
                            </div>

                            {Object.values(THEMES).map((themeOption, index) => (
                                <motion.button
                                    key={themeOption}
                                    onClick={() => handleThemeChange(themeOption)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        width: "100%",
                                        padding: "var(--spacing-md)",
                                        background: theme === themeOption ? "rgba(255, 255, 255, 0.1)" : "transparent",
                                        border: theme === themeOption ? "1px solid var(--color-primary)" : "1px solid transparent",
                                        borderRadius: "var(--radius-md)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--spacing-md)",
                                        cursor: "pointer",
                                        marginBottom: "var(--spacing-xs)",
                                        transition: "all var(--transition-base)",
                                        color: "var(--text-primary)",
                                        fontSize: "0.875rem",
                                        fontWeight: theme === themeOption ? "600" : "400",
                                    }}
                                >
                                    <span style={{ fontSize: "1.5rem" }}>{themeIcons[themeOption]}</span>
                                    <span style={{ flex: 1, textAlign: "left" }}>{themeNames[themeOption]}</span>
                                    {theme === themeOption && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            style={{
                                                width: "8px",
                                                height: "8px",
                                                borderRadius: "50%",
                                                background: "var(--color-primary)",
                                                boxShadow: "var(--glow-primary)",
                                            }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
