/**
 * Sun service for calculating sun position and state.
 */

import { calculateSunPosition, type SunPosition } from "@sungaze/core";

/**
 * Gets the current sun state (position) for a given location.
 * @param lat - Latitude in degrees
 * @param lon - Longitude in degrees
 * @param timezone - Optional timezone string (e.g., "Europe/Zurich")
 * @returns Sun position with altitude and azimuth in degrees
 */
export function getSunState(
  lat: number,
  lon: number,
  _timezone?: string
): SunPosition {
  // Use shared logic from @sungaze/core
  return calculateSunPosition(lat, lon);
}
