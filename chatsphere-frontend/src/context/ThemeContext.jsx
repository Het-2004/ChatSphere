import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
    theme: "cyberpunk",
    setTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

// Available premium themes
export const THEMES = {
    CYBERPUNK: "cyberpunk",
    SUNSET: "sunset",
    OCEAN: "ocean",
    FOREST: "forest",
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(
        localStorage.getItem("chatsphere-theme") || THEMES.CYBERPUNK
    );

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove all theme classes
        Object.values(THEMES).forEach(t => root.classList.remove(t));

        // Add current theme class
        root.classList.add(theme);

        // Set data attribute for CSS targeting
        root.setAttribute('data-theme', theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (newTheme) => {
            setTheme(newTheme);
            localStorage.setItem("chatsphere-theme", newTheme);
        },
        themes: THEMES,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
