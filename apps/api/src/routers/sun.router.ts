/**
 * Sun router for tRPC queries related to sun state.
 */

import { publicProcedure, router } from "../trpc";
import { getLocationFromIp } from "../services/location.service";
import { getSunState } from "../services/sun.service";
import { SunStateResponseSchema } from "@sungaze/core";

export const sunRouter = router({
  getInitialState: publicProcedure.query(async ({ ctx }) => {
    try {
      const { ip } = ctx;

      // Get location from IP address
      const location = await getLocationFromIp(ip);

      // Get sun position for the location (using location's timezone context)
      const sun = getSunState(location.lat, location.lon, location.timezone);

      // Construct response
      const response = {
        location,
        sun,
        timestamp: new Date().toISOString(),
      };

      // Validate and return
      return SunStateResponseSchema.parse(response);
    } catch (error) {
      console.error("Error in getInitialState:", error);
      throw error;
    }
  }),
});
