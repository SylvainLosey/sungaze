/**
 * Sun service for calculating sun position and state.
 */

import * as SunCalc from 'suncalc';

export interface SunPosition {
  altitude: number;
  azimuth: number;
}

/**
 * Gets the current sun state (position) for a given location.
 * @param lat - Latitude in degrees
 * @param lon - Longitude in degrees
 * @returns Sun position with altitude and azimuth in radians
 */
export function getSunState(lat: number, lon: number): SunPosition {
  const now = new Date();
  const position = SunCalc.getPosition(now, lat, lon);

  return {
    altitude: position.altitude,
    azimuth: position.azimuth,
  };
}

