import { motion } from "framer-motion";

/**
 * Premium Background Component
 * Lightweight gradient-based design for better performance
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
                background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f23 100%)",
            }}
        >
            {/* Gradient Overlay */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "radial-gradient(ellipse at 30% 20%, rgba(0, 243, 255, 0.08), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.06), transparent 50%)",
                }}
            />

            {/* Subtle animated glow */}
            <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    top: "20%",
                    left: "40%",
                    width: "40vw",
                    height: "40vw",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(0, 243, 255, 0.05), transparent 70%)",
                    filter: "blur(60px)",
                }}
            />
        </div>
    );
}
