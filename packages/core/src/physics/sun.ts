/**
 * Shared sun calculation logic.
 * Uses SunCalc to calculate sun position based on location and time.
 */

import * as SunCalc from "suncalc";
import { radiansToDegrees } from "../utils/math";
import type { SunPosition } from "../schemas/sun.schema";

/**
 * Calculates the sun position for a given location and time.
 * This is the single source of truth for sun calculations across all apps.
 *
 * @param lat - Latitude in degrees
 * @param lon - Longitude in degrees
 * @param date - Date object for calculation (defaults to now)
 * @returns Sun position with altitude and azimuth in degrees
 */
export function calculateSunPosition(
  lat: number,
  lon: number,
  date: Date = new Date()
): SunPosition {
  const position = SunCalc.getPosition(date, lat, lon);

  return {
    altitudeDegrees: radiansToDegrees(position.altitude),
    azimuthDegrees: radiansToDegrees(position.azimuth),
  };
}
