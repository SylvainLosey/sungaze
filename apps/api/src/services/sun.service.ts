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
 * @returns Sun position with altitude and azimuth in degrees
 */
export function getSunState(lat: number, lon: number): SunPosition {
  const now = new Date();
  const position = SunCalc.getPosition(now, lat, lon);

  return {
    altitudeDegrees: radiansToDegrees(position.altitude),
    azimuthDegrees: radiansToDegrees(position.azimuth),
  };
}
