/**
 * Shared sun calculation logic.
 * Uses SunCalc to calculate sun position based on location and time.
 */

import * as SunCalc from "suncalc";
import { radiansToDegrees } from "../utils/math";
import { calculateExposure } from "./exposure";
import type { SunState } from "../schemas/sun.schema";

/**
 * Calculates the sun state (position and exposure) for a given location and time.
 * This is the single source of truth for sun calculations across all apps.
 *
 * @param lat - Latitude in degrees
 * @param lon - Longitude in degrees
 * @param date - Date object for calculation (defaults to now)
 * @returns Sun state with altitude, exposure percentages (UVA, UVB, IR)
 */
export function calculateSunState(
  lat: number,
  lon: number,
  date: Date = new Date()
): SunState {
  const position = SunCalc.getPosition(date, lat, lon);
  const altitudeDegrees = radiansToDegrees(position.altitude);
  const exposure = calculateExposure(altitudeDegrees);

  return {
    altitudeDegrees,
    exposure,
  };
}
