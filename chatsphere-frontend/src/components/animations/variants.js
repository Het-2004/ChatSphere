export const cardVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 20, delay: 0.2 }
    },
    hover: { scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } }
};

export const buttonVariants = {
    hover: { scale: 1.05, filter: "brightness(1.1)" },
    tap: { scale: 0.95 }
};

export const shakeVariants = {
    initial: { x: 0 },
    shake: {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
    }
};

export const containerVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

export const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
};

export const messageBubbleVariants = {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    hover: { scale: 1.01 }
};

export const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 200 }
    }
};
