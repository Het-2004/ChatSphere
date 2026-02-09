import { motion } from "framer-motion";

export default function LoadingSpinner({ size = 40, color = "var(--color-primary)" }) {
    return (
        <motion.div
            style={{
                display: "inline-block",
                width: size,
                height: size,
                borderRadius: "50%",
                border: `3px solid ${color}`,
                borderTopColor: "transparent",
                boxSizing: "border-box"
            }}
            animate={{ rotate: 360 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
            }}
        />
    );
}
