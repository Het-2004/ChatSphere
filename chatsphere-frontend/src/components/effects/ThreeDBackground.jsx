import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// Animated 3D sphere
function AnimatedSphere({ position, color, speed }) {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * speed;
            meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.5;
        }
    });

    return (
        <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
            <MeshDistortMaterial
                color={color}
                attach="material"
                distort={0.4}
                speed={2}
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    );
}

// Floating particles
function Particles({ count = 100 }) {
    const points = useRef();

    const particlesPosition = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        particlesPosition[i * 3] = (Math.random() - 0.5) * 20;
        particlesPosition[i * 3 + 1] = (Math.random() - 0.5) * 20;
        particlesPosition[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                color="#ffffff"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

// Main 3D Scene
function Scene() {
    // Get theme color from CSS
    const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary")
        .trim() || "#00f3ff";

    const secondaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-secondary")
        .trim() || "#b026ff";

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color={primaryColor} />

            <AnimatedSphere position={[-3, 0, 0]} color={primaryColor} speed={0.3} />
            <AnimatedSphere position={[3, 0, 0]} color={secondaryColor} speed={0.2} />

            <Particles count={150} />

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
            />
        </>
    );
}

/**
 * 3D Background using Three.js
 * Animated spheres with distortion and floating particles
 */
export default function ThreeDBackground() {
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
                opacity: 0.3,
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 10], fov: 75 }}
                style={{ background: "transparent" }}
            >
                <Scene />
            </Canvas>
        </div>
    );
}
