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
 * Schema for sun position data.
 * Altitude and azimuth are in degrees.
 */
export const SunPositionSchema = z.object({
  altitudeDegrees: z.number(),
  azimuthDegrees: z.number(),
});

/**
 * Schema for the complete sun state response.
 */
export const SunStateResponseSchema = z.object({
  location: LocationSchema,
  sun: SunPositionSchema,
  timestamp: z.string(), // ISO timestamp string
});

// Export inferred types for use across the monorepo
export type SunStateResponse = z.infer<typeof SunStateResponseSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type SunPosition = z.infer<typeof SunPositionSchema>;
