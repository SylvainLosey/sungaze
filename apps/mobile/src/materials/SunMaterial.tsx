/**
 * Custom shader material for realistic sun rendering.
 * Handles fractal noise surface, glow, and Fresnel effects.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber/native";
import * as THREE from "three";
import { sunVertexShader } from "@/shaders/sun.vert";
import { sunFragmentShader } from "@/shaders/sun.frag";
import { hexToVec3 } from "@/utils/color";

interface SunMaterialProps {
  color: string;
}

/**
 * Sun shader material component that updates uniforms each frame.
 */
export function SunMaterial({ color }: SunMaterialProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const colorVec3 = hexToVec3(color);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.u_color.value.set(
        colorVec3[0],
        colorVec3[1],
        colorVec3[2]
      );
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={sunVertexShader}
      fragmentShader={sunFragmentShader}
      uniforms={{
        u_time: { value: 0 },
        u_color: { value: new THREE.Vector3(...colorVec3) },
      }}
      side={THREE.DoubleSide}
    />
  );
}
