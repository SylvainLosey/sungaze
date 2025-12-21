/**
 * 3D Sun Scene using React Three Fiber.
 * Displays a realistic sun with fractal noise surface, glow, and Fresnel effects.
 */

import { Canvas } from "@react-three/fiber/native";
import { OrbitControls } from "@react-three/drei/native";
import { useSunContext } from "@/context/SunContext";
import { SunSphere } from "@/components/SunSphere";

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
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      <SunSphere altitudeDegrees={altitudeDegrees} />
    </Canvas>
  );
}
