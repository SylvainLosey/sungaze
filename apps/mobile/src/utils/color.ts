/**
 * Color utility functions for sun rendering.
 * Provides non-worklet versions of color interpolation for use in React components.
 */

/**
 * Converts hex color string to RGB vector [r, g, b] normalized to 0-1 range.
 */
export function hexToVec3(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

/**
 * Linear interpolation between two hex colors.
 */
function lerpColor(color1: string, color2: string, t: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Interpolates sun color based on altitude (non-worklet version for React components).
 * Matches the color range from solar-interpolation.ts but works outside Reanimated worklets.
 */
export function interpolateSunColor(altitude: number): string {
  const inputRange = [-18, -6, 0, 12, 20, 30, 45, 60];
  const outputRange = [
    "#1a1a2e",
    "#5a4fcf",
    "#ff6b9d",
    "#ffd60a",
    "#ffed4e",
    "#fff9a5",
    "#fffacd",
    "#fff8dc",
  ];

  if (altitude <= inputRange[0]) return outputRange[0];
  if (altitude >= inputRange[inputRange.length - 1])
    return outputRange[outputRange.length - 1];

  for (let i = 0; i < inputRange.length - 1; i++) {
    if (altitude >= inputRange[i] && altitude <= inputRange[i + 1]) {
      const t =
        (altitude - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
      return lerpColor(outputRange[i], outputRange[i + 1], t);
    }
  }

  return outputRange[0];
}

