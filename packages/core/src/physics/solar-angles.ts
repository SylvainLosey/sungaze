/**
 * Solar angle constants for different phases of the day.
 * Values are in degrees of altitude.
 */

export const SOLAR_ANGLES = {
  /** Astronomical dawn: Sun is 18° below the horizon */
  ASTRONOMICAL_DAWN: -18,
  /** Nautical dawn: Sun is 12° below the horizon */
  NAUTICAL_DAWN: -12,
  /** Civil dawn: Sun is 6° below the horizon */
  CIVIL_DAWN: -6,
  /** Sunrise: Sun is at the horizon */
  SUNRISE: 0,
  /** UVA start: Sun is 12° above the horizon */
  UVA_START: 12,
} as const;
