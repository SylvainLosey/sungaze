/**
 * Solar color interpolation inspired by Apple Watch Solar face.
 * Maps sun altitude (in degrees) to vibrant color spectrum.
 */

import { interpolateColor } from "react-native-reanimated";
import { SOLAR_ANGLES } from "@sungaze/core";

/**
 * Input range for color interpolation (altitude in degrees).
 */
export const SOLAR_COLOR_INPUT_RANGE = [
  SOLAR_ANGLES.ASTRONOMICAL_DAWN, // -18
  SOLAR_ANGLES.CIVIL_DAWN, // -6
  SOLAR_ANGLES.SUNRISE, // 0
  SOLAR_ANGLES.UVA_START, // 12
  45, // Daylight
] as const;

/**
 * Output range for sky background colors.
 */
export const SKY_COLOR_OUTPUT_RANGE = [
  "#000814", // Night (Astronomical Dawn)
  "#4831d4", // Civil Twilight/Deep Purple
  "#ff4d6d", // Sunrise/Infrared Pink
  "#ffb703", // UVA/Golden
  "#00b4d8", // Daylight Blue
] as const;

/**
 * Output range for sun emissive colors.
 */
export const SUN_COLOR_OUTPUT_RANGE = [
  "#1a1a2e", // Night (darker)
  "#5a4fcf", // Civil Twilight (brighter purple)
  "#ff6b9d", // Sunrise (brighter pink)
  "#ffd60a", // UVA (brighter gold)
  "#48cae4", // Daylight (brighter cyan)
] as const;

/**
 * Helper function to interpolate sky color.
 * Use this within useAnimatedStyle.
 * @param altitudeValue - Current altitude value (from shared value)
 * @returns Interpolated color string
 */
export function interpolateSkyColor(altitudeValue: number): string {
  return interpolateColor(
    altitudeValue,
    SOLAR_COLOR_INPUT_RANGE,
    SKY_COLOR_OUTPUT_RANGE,
    "RGB"
  );
}

/**
 * Helper function to interpolate sun color.
 * Use this within useAnimatedStyle.
 * @param altitudeValue - Current altitude value (from shared value)
 * @returns Interpolated color string
 */
export function interpolateSunColor(altitudeValue: number): string {
  return interpolateColor(
    altitudeValue,
    SOLAR_COLOR_INPUT_RANGE,
    SUN_COLOR_OUTPUT_RANGE,
    "RGB"
  );
}
