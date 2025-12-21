/**
 * Sun sphere mesh component.
 * Positions the sun based on altitude and applies the custom shader material.
 */

import { useMemo } from "react";
import { SunMaterial } from "@/materials/SunMaterial";
import { interpolateSunColor } from "@/utils/color";

interface SunSphereProps {
  altitudeDegrees: number;
}

/**
 * Sun sphere that reacts to altitude changes.
 * At 0° (horizon), Y = 0; At 90° (zenith), Y = 1.
 */
export function SunSphere({ altitudeDegrees }: SunSphereProps) {
  const yPosition = altitudeDegrees / 90;
  const color = useMemo(
    () => interpolateSunColor(altitudeDegrees),
    [altitudeDegrees]
  );

  return (
    <mesh position={[0, yPosition, 0]}>
      <sphereGeometry args={[0.5, 64, 64]} />
      <SunMaterial color={color} />
    </mesh>
  );
}

