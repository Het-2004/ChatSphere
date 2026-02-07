import { motion } from "framer-motion";
import { spinnerVariants } from "../animations/variants";

/**
 * Premium 3D loading spinner
 */
export default function LoadingSpinner({ size = 40 }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
            }}
        >
            <motion.div
                variants={spinnerVariants}
                animate="animate"
                style={{
                    width: size,
                    height: size,
                    border: "3px solid transparent",
                    borderTopColor: "var(--color-primary)",
                    borderRightColor: "var(--color-secondary)",
                    borderRadius: "50%",
                    position: "relative",
                }}
            >
                <motion.div
                    variants={spinnerVariants}
                    animate="animate"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: size * 0.6,
                        height: size * 0.6,
                        border: "3px solid transparent",
                        borderBottomColor: "var(--color-primary)",
                        borderLeftColor: "var(--color-secondary)",
                        borderRadius: "50%",
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                        direction: "reverse",
                    }}
                />
            </motion.div>
        </div>
    );
}
