import { motion } from "framer-motion";

/**
 * Premium Background Component
 * Based on the requested "other app" style (animated-weather-app)
 * Uses high-quality Unsplash image with overlay
 */
export default function Background() {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                pointerEvents: "none",
            }}
        >
            {/* Background Image */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=90&w=3840&h=2160')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: "brightness(0.7) contrast(1.1)", // Slight adjustment for text readability
                }}
            />

            {/* Overlay Gradient (from weather app) */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(45deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3))", // Darkened slightly for ChatSphere
                }}
            />

            {/* Subtle animated element (optional, matches "Cyberpunk" feel) */}
            <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "radial-gradient(circle at 50% 50%, rgba(0, 243, 255, 0.05), transparent 70%)",
                }}
            />
        </div>
    );
}
