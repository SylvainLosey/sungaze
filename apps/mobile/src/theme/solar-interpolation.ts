/**
 * Solar color interpolation inspired by Apple Watch Solar face.
 * Maps sun altitude (in degrees) to vibrant color spectrum.
 */

import { interpolateColor } from "react-native-reanimated";
import { SOLAR_ANGLES } from "@sungaze/core";

/**
 * Input range for color interpolation (altitude in degrees).
 */
export const SOLAR_COLOR_INPUT_RANGE: number[] = [
  SOLAR_ANGLES.ASTRONOMICAL_DAWN, // -18
  SOLAR_ANGLES.CIVIL_DAWN, // -6
  SOLAR_ANGLES.SUNRISE, // 0
  SOLAR_ANGLES.UVA_START, // 12
  20, // Morning
  30, // Mid-morning
  45, // Midday
  60, // Afternoon
];

/**
 * Output range for sky background colors.
 * Lighter, more pastel colors for daytime.
 * Adjusted for lower angles (9-12°) to be more muted.
 */
export const SKY_COLOR_OUTPUT_RANGE: string[] = [
  "#000814", // Night (Astronomical Dawn)
  "#4831d4", // Civil Twilight/Deep Purple
  "#ff4d6d", // Sunrise/Infrared Pink
  "#d4a574", // UVA (muted tan/beige instead of bright orange)
  "#e8d5b7", // Morning (warm beige)
  "#f0e6d2", // Mid-morning (light beige)
  "#e8f4f8", // Midday (very light blue)
  "#d4e8f0", // Afternoon (light sky blue)
];

/**
 * Output range for sun emissive colors.
 */
export const SUN_COLOR_OUTPUT_RANGE: string[] = [
  "#1a1a2e", // Night (darker)
  "#5a4fcf", // Civil Twilight (brighter purple)
  "#ff6b9d", // Sunrise (brighter pink)
  "#ffd60a", // UVA (brighter gold)
  "#ffed4e", // Morning (bright yellow)
  "#fff9a5", // Mid-morning (pale yellow)
  "#fffacd", // Midday (lemon chiffon)
  "#fff8dc", // Afternoon (cornsilk)
];

/**
 * Helper function to interpolate sky color.
 * Use this within useAnimatedStyle.
 * @param altitudeValue - Current altitude value (from shared value)
 * @returns Interpolated color (works in worklets)
 */
export function interpolateSkyColor(altitudeValue: number) {
  "worklet";
  return interpolateColor(
    altitudeValue,
    SOLAR_COLOR_INPUT_RANGE,
    SKY_COLOR_OUTPUT_RANGE
  );
}

/**
 * Helper function to interpolate sun color.
 * Use this within useAnimatedStyle.
 * @param altitudeValue - Current altitude value (from shared value)
 * @returns Interpolated color (works in worklets)
 */
export function interpolateSunColor(altitudeValue: number) {
  "worklet";
  return interpolateColor(
    altitudeValue,
    SOLAR_COLOR_INPUT_RANGE,
    SUN_COLOR_OUTPUT_RANGE
  );
}
