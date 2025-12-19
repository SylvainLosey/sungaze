/**
 * Sun service for calculating sun state (position and exposure).
 */

import { calculateSunState, type SunState } from "@sungaze/core";

/**
 * Gets the current sun state (altitude and exposure) for a given location.
 * @param lat - Latitude in degrees
 * @param lon - Longitude in degrees
 * @param _timezone - Optional timezone string (e.g., "Europe/Zurich")
 * @returns Sun state with altitude and exposure percentages (UVA, UVB, IR)
 */
export function getSunState(
  lat: number,
  lon: number,
  _timezone?: string
): SunState {
  // Use shared logic from @sungaze/core
  return calculateSunState(lat, lon);
}
