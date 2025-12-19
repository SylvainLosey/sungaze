/**
 * Sun service for calculating sun position and state.
 */

import * as SunCalc from "suncalc";
import { radiansToDegrees } from "@sungaze/core";

/**
 * Sun position in degrees.
 */
export interface SunPosition {
  altitudeDegrees: number;
  azimuthDegrees: number;
}

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
  timezone?: string
): SunPosition {
  // Use current time - SunCalc handles timezone internally based on lat/lon
  // The date object represents the local time at the location
  const now = new Date();
  const position = SunCalc.getPosition(now, lat, lon);

  return {
    altitudeDegrees: radiansToDegrees(position.altitude),
    azimuthDegrees: radiansToDegrees(position.azimuth),
  };
}
