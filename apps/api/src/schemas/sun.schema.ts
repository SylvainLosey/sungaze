/**
 * Zod schemas for sun state validation.
 */

import { z } from "zod";

/**
 * Schema for location data.
 */
const LocationSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  city: z.string(),
  timezone: z.string(),
});

/**
 * Schema for sun position data.
 */
const SunPositionSchema = z.object({
  altitude: z.number(),
  azimuth: z.number(),
});

/**
 * Schema for the complete sun state response.
 */
export const SunStateResponseSchema = z.object({
  location: LocationSchema,
  sun: SunPositionSchema,
  timestamp: z.string(), // ISO timestamp string
});

export type SunStateResponse = z.infer<typeof SunStateResponseSchema>;
