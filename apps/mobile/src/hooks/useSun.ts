/**
 * Hook to get sun altitude for components.
 */

import { useSunContext } from "@/context/SunContext";

/**
 * Hook to get the raw sun altitude.
 * @returns The sun altitude in radians, or null if not ready
 */
export function useSun() {
  const { altitude } = useSunContext();
  return altitude;
}

