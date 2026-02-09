import { useRef, useEffect } from "react";

/**
 * Cyberfield Background
 * A retro-futuristic moving grid with a starfield.
 * "Cyberpunk" aesthetic: Dark purple/blue grid with neon pink/cyan horizons.
 */
export default function ParticlesBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // --- Configuration ---
        const STAR_COUNT = 200;
        const GRID_SIZE = 40;
        const SPEED = 2; // Movement speed

        // Colors
        const BG_COLOR = "#050510"; // Deep space
        const GRID_COLOR = "#00f3ff"; // Cyan neon
        const HORIZON_COLOR = "#bc13fe"; // Magenta neon

        // --- State ---
        let offset = 0;

        // --- Stars ---
        const stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * 0.6, // Top 60% only
                size: Math.random() * 2,
                opacity: Math.random(),
                speed: Math.random() * 0.5
            });
        }

        const drawStars = () => {
            ctx.fillStyle = "white";
            stars.forEach(star => {
                ctx.globalAlpha = star.opacity;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1.0;
        };

        const drawGrid = () => {
            // Horizon line (approx 60% down)
            const horizonY = canvas.height * 0.6;
            const w = canvas.width;
            const h = canvas.height;
            const centerX = w / 2;

            // Gradient for grid fade
            const gradient = ctx.createLinearGradient(0, horizonY, 0, h);
            gradient.addColorStop(0, HORIZON_COLOR); // Pink at horizon
            gradient.addColorStop(0.5, GRID_COLOR);  // Cyan in middle
            gradient.addColorStop(1, "transparent"); // Fade out near bottom

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;

            // 1. Vertical Lines (Fan out from vanishing point)
            ctx.beginPath();
            // We draw lines from vanishing point (center, horizon) to points along the bottom edge
            // Spacing at bottom determines density
            const bottomSpacing = GRID_SIZE * 4;
            // Extend explicitly beyond width to ensure coverage when fanning
            const numLines = Math.ceil(w / bottomSpacing) * 2;

            for (let i = -numLines; i <= numLines; i++) {
                // Calculate x at bottom of screen
                const bottomX = centerX + (i * bottomSpacing);

                ctx.moveTo(centerX, horizonY);
                ctx.lineTo(bottomX, h);
            }
            ctx.stroke();

            // 2. Horizontal Lines (Moving towards viewer)
            // Z represents depth. We move the "grid" by adjusting the starting Z offset.
            offset = (offset + SPEED) % GRID_SIZE;

            ctx.beginPath();
            // We iterate from "near" (bottom) to "far" (horizon)
            // Perspective projection: y = horizonY + (scale / z)
            // We increment z linearly in 3D space

            const perspectiveScale = 300; // Controls how "deep" the grid looks

            // Draw lines from z=10 (near) to z=400 (far)
            for (let z = 10; z < 400; z += GRID_SIZE) {
                const currentZ = z - offset;
                if (currentZ <= 0) continue;

                // Project 3D Z to 2D Y
                // The larger the Z, the closer to 0 (horizon)
                const yOffset = perspectiveScale * (10 / currentZ); // Simple inverse projection
                const screenY = h - yOffset * 5; // Scale up to fill screen

                if (screenY < horizonY) continue;
                if (screenY > h) continue;

                ctx.moveTo(0, screenY);
                ctx.lineTo(w, screenY);
            }
            ctx.stroke();

            // Horizon Glow
            ctx.shadowBlur = 20;
            ctx.shadowColor = HORIZON_COLOR;
            ctx.fillStyle = HORIZON_COLOR;
            ctx.fillRect(0, horizonY - 2, w, 4);

            // Fill bottom with semi-transparent black to fade grid slightly
            const fadeGradient = ctx.createLinearGradient(0, horizonY, 0, h);
            fadeGradient.addColorStop(0, "rgba(5,5,16, 0.2)");
            fadeGradient.addColorStop(0.8, "rgba(5,5,16, 0.8)"); // Darker near bottom
            ctx.fillStyle = fadeGradient;
            ctx.fillRect(0, horizonY, w, h - horizonY);
        };

        const animate = () => {
            // Clear
            ctx.fillStyle = BG_COLOR;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.shadowBlur = 0;

            drawStars();
            drawGrid();

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: -1, // Ensure it's behind everything
                background: "#050510",
            }}
        />
    );
}
