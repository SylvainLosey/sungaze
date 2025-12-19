/**
 * 3D Sun Scene using React Three Fiber.
 * Displays a sun sphere positioned based on altitude and colored based on sun interpolation.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { useSunContext } from "@/context/SunContext";
import { interpolateSunColor } from "@/theme/solar-interpolation";
import { degreesToRadians } from "@sungaze/core";
import * as THREE from "three";

/**
 * Sun sphere component that reacts to altitude changes.
 */
function SunSphere({ altitudeDegrees }: { altitudeDegrees: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [color, setColor] = useState("#ffb703");

  // Convert altitude to Y position
  // At 0° (horizon), Y = 0
  // At 90° (zenith), Y = 1
  // At -18° (below horizon), Y = -0.2
  const yPosition = altitudeDegrees / 90;

  // Update color based on altitude
  useEffect(() => {
    const newColor = interpolateSunColor(altitudeDegrees);
    setColor(newColor);
  }, [altitudeDegrees]);

  // Convert hex color to RGB for Three.js
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 1, g: 0.7, b: 0 };
  };

  const rgbColor = hexToRgb(color);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y = yPosition;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, yPosition, 0]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial
        color={[rgbColor.r, rgbColor.g, rgbColor.b]}
        emissive={[rgbColor.r, rgbColor.g, rgbColor.b]}
        emissiveIntensity={1.5}
      />
    </mesh>
  );
}

/**
 * Horizon line at Y=0.
 */
function Horizon() {
  return (
    <mesh position={[0, 0, 0]} rotation={[degreesToRadians(90), 0, 0]}>
      <ringGeometry args={[0.8, 1.0, 64]} />
      <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
    </mesh>
  );
}

/**
 * Main Sun Scene component.
 */
export function SunScene() {
  const { altitudeDegrees, isReady } = useSunContext();

  if (!isReady || altitudeDegrees === null) {
    return null;
  }

  return (
    <Canvas
      style={{ flex: 1 }}
      camera={{ position: [0, 0, 2], fov: 75 }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <SunSphere altitudeDegrees={altitudeDegrees} />
      <Horizon />
    </Canvas>
  );
}
