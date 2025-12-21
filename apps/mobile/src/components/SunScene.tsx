/**
 * 3D Sun Scene using React Three Fiber.
 * Displays a sun sphere positioned based on altitude and colored based on sun interpolation.
 */

/* eslint-disable react/no-unknown-property */
import { Canvas } from "@react-three/fiber/native";
import { OrbitControls } from "@react-three/drei/native";
import { useSunContext } from "@/context/SunContext";
import { interpolateSunColor } from "@/theme/solar-interpolation";

/**
 * Sun sphere component that reacts to altitude changes.
 */
function SunSphere({ altitudeDegrees }: { altitudeDegrees: number }) {
  // Convert altitude to Y position
  // At 0° (horizon), Y = 0
  // At 90° (zenith), Y = 1
  const yPosition = altitudeDegrees / 90;
  const color = interpolateSunColor(altitudeDegrees);

  return (
    <mesh position={[0, yPosition, 0]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
      />
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
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      <SunSphere altitudeDegrees={altitudeDegrees} />
    </Canvas>
  );
}
