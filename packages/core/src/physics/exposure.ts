/**
 * Exposure calculation based on solar altitude.
 * Calculates the percentage of IR, UVA, and UVB radiation reaching the user.
 * Uses simplified atmospheric model with air mass calculations.
 */

/**
 * Calculates exposure percentages for IR, UVA, and UVB based on sun altitude.
 *
 * @param altitudeDegrees - Sun altitude in degrees (0 = horizon, 90 = zenith)
 * @returns Object with uva, uvb, and ir percentages (0-100)
 */
export function calculateExposure(altitudeDegrees: number): {
  uva: number;
  uvb: number;
  ir: number;
} {
  // Below horizon = no exposure
  if (altitudeDegrees <= 0) {
    return { uva: 0, uvb: 0, ir: 0 };
  }

  // Convert altitude to radians
  const altitudeRad = (altitudeDegrees * Math.PI) / 180;

  // Calculate air mass: path length through atmosphere relative to zenith
  // AM = 1 / sin(altitude) when altitude > 0
  const airMass = 1 / Math.sin(altitudeRad);

  // Extinction coefficients (higher = faster absorption as airMass increases)
  // These are simplified values based on atmospheric physics
  const k_uvb = 1.1; // UVB is highly absorbed by ozone and scattered
  const k_uva = 0.4; // UVA is less absorbed but still scattered
  const k_ir = 0.1;  // IR is least affected by atmosphere

  // Beer-Lambert law: Intensity = I0 * exp(-k * (AM - 1))
  // We normalize to percentage (0-100) where AM=1 (zenith) = 100%
  const uvb = Math.max(0, Math.min(100, Math.exp(-k_uvb * (airMass - 1)) * 100));
  const uva = Math.max(0, Math.min(100, Math.exp(-k_uva * (airMass - 1)) * 100));
  const ir = Math.max(0, Math.min(100, Math.exp(-k_ir * (airMass - 1)) * 100));

  return { uva, uvb, ir };
}

