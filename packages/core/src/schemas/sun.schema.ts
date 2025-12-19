/**
 * Zod schemas for sun state validation.
 * This is the single source of truth for sun-related schemas shared across all apps.
 */

import { z } from "zod";

/**
 * Schema for location data.
 */
export const LocationSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  city: z.string(),
  timezone: z.string(),
});

/**
 * Schema for exposure percentages (0-100).
 */
export const ExposureSchema = z.object({
  uva: z.number().min(0).max(100),
  uvb: z.number().min(0).max(100),
  ir: z.number().min(0).max(100),
});

/**
 * Schema for sun state data.
 * Contains altitude (in degrees) and exposure percentages.
 */
export const SunStateSchema = z.object({
  altitudeDegrees: z.number(),
  exposure: ExposureSchema,
});

/**
 * Schema for the complete sun state response.
 */
export const SunStateResponseSchema = z.object({
  location: LocationSchema,
  sun: SunStateSchema,
  timestamp: z.string(), // ISO timestamp string
});

// Export inferred types for use across the monorepo
export type SunStateResponse = z.infer<typeof SunStateResponseSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type SunState = z.infer<typeof SunStateSchema>;
export type Exposure = z.infer<typeof ExposureSchema>;
