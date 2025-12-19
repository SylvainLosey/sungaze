/**
 * Hook to get sun altitude for components.
 */

import { useSunContext } from "@/context/SunContext";

/**
 * Hook to get the raw sun altitude in degrees.
 * @returns The sun altitude in degrees, or null if not ready
 */
export function useSun() {
  const { altitudeDegrees } = useSunContext();
  return altitudeDegrees;
}
