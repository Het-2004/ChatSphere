/**
 * Framer Motion Animation Variants
 * Reusable animation configurations for consistent motion design
 */

// Page transitions
export const pageVariants = {
    initial: {
        opacity: 0,
        scale: 0.95,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.3,
        },
    },
};

// Card animations
export const cardVariants = {
    initial: {
        opacity: 0,
        y: 20,
        rotateX: -15,
    },
    animate: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
    hover: {
        y: -8,
        rotateX: 5,
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
        },
    },
    tap: {
        scale: 0.98,
    },
};

// Stagger children
export const containerVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export const itemVariants = {
    initial: {
        opacity: 0,
        x: -20,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24,
        },
    },
};

// Slide animations
export const slideVariants = {
    left: {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -100, opacity: 0 },
    },
    right: {
        initial: { x: 100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 100, opacity: 0 },
    },
    up: {
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 100, opacity: 0 },
    },
    down: {
        initial: { y: -100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -100, opacity: 0 },
    },
};

// Button animations
export const buttonVariants = {
    initial: {
        scale: 1,
    },
    hover: {
        scale: 1.05,
        y: -2,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
        },
    },
    tap: {
        scale: 0.95,
    },
};

// Input focus animations
export const inputVariants = {
    initial: {
        scale: 1,
        borderColor: "var(--border-color)",
    },
    focus: {
        scale: 1.02,
        borderColor: "var(--color-primary)",
        boxShadow: "0 0 0 3px rgba(var(--color-primary), 0.1)",
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
        },
    },
};

// Message bubble animations
export const messageBubbleVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.8,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 30,
        },
    },
    hover: {
        scale: 1.02,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
        },
    },
};

// Modal animations
export const modalVariants = {
    initial: {
        opacity: 0,
        scale: 0.8,
        y: 50,
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        y: 50,
        transition: {
            duration: 0.2,
        },
    },
};

// Backdrop animations
export const backdropVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};

// Floating animation
export const floatVariants = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

// Pulse animation
export const pulseVariants = {
    animate: {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

// Glow animation
export const glowVariants = {
    animate: {
        boxShadow: [
            "0 0 20px rgba(var(--color-primary), 0.3)",
            "0 0 40px rgba(var(--color-primary), 0.6)",
            "0 0 20px rgba(var(--color-primary), 0.3)",
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

// Shake animation (for errors)
export const shakeVariants = {
    shake: {
        x: [0, -10, 10, -10, 10, 0],
        transition: {
            duration: 0.5,
        },
    },
};

// Success animation
export const successVariants = {
    initial: {
        scale: 0,
        rotate: -180,
    },
    animate: {
        scale: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 15,
        },
    },
};

// Loading spinner
export const spinnerVariants = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: "linear",
        },
    },
};

// Ripple effect
export const rippleVariants = {
    initial: {
        scale: 0,
        opacity: 1,
    },
    animate: {
        scale: 2,
        opacity: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};
