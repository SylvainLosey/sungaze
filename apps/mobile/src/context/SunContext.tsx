/**
 * Sun Context for managing sun state and location data.
 * Uses Reanimated shared values for smooth animations.
 */

import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { trpc } from "@/lib/trpc";
import { createTRPCClient } from "@/lib/trpc-client";
import { calculateSunPosition, type Location } from "@sungaze/core";
import {
  interpolateSkyColor,
  interpolateSunColor,
} from "@/theme/solar-interpolation";

interface SunContextValue {
  altitudeDegrees: number | null;
  azimuthDegrees: number | null;
  location: Location | null;
  isReady: boolean;
  // Animated shared values
  altitudeShared: ReturnType<typeof useSharedValue<number>>;
  azimuthShared: ReturnType<typeof useSharedValue<number>>;
  // Animated styles
  skyStyle: ReturnType<typeof useAnimatedStyle>;
  sunStyle: ReturnType<typeof useAnimatedStyle>;
}

const SunContext = createContext<SunContextValue | undefined>(undefined);

interface SunProviderProps {
  children: ReactNode;
}

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export function SunProvider({ children }: SunProviderProps) {
  const trpcClient = trpc.createClient(createTRPCClient());

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SunContextInner>{children}</SunContextInner>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function SunContextInner({ children }: SunProviderProps) {
  // Fetch sun state and location on mount from API
  const { data, isLoading, error } = trpc.sun.getInitialState.useQuery();

  // React state for live updates (for regular React components)
  const [liveAltitude, setLiveAltitude] = React.useState<number | null>(null);
  const [liveAzimuth, setLiveAzimuth] = React.useState<number | null>(null);

  // Shared values for smooth animations (for Reanimated/Worklets)
  const altitudeShared = useSharedValue<number>(
    data?.sun.altitudeDegrees ?? 30
  );
  const azimuthShared = useSharedValue<number>(data?.sun.azimuthDegrees ?? 0);

  // Initialize live state from API data
  useEffect(() => {
    if (data?.sun) {
      setLiveAltitude(data.sun.altitudeDegrees);
      setLiveAzimuth(data.sun.azimuthDegrees);
      altitudeShared.value = data.sun.altitudeDegrees;
      azimuthShared.value = data.sun.azimuthDegrees;
    }
  }, [data?.sun, altitudeShared, azimuthShared]);

  // Live update loop
  useEffect(() => {
    if (!data?.location) return;

    const updateSunPosition = () => {
      const { lat, lon } = data.location;
      const currentPos = calculateSunPosition(lat, lon);

      // Update React state
      setLiveAltitude(currentPos.altitudeDegrees);
      setLiveAzimuth(currentPos.azimuthDegrees);

      // Update shared values with timing for smooth transitions
      altitudeShared.value = withTiming(currentPos.altitudeDegrees, {
        duration: 2000,
      });
      azimuthShared.value = withTiming(currentPos.azimuthDegrees, {
        duration: 2000,
      });

      console.log(
        `[Live Update] Altitude: ${currentPos.altitudeDegrees.toFixed(
          2
        )}°, Azimuth: ${currentPos.azimuthDegrees.toFixed(2)}°`
      );
    };

    // Update every 30 seconds
    const interval = setInterval(updateSunPosition, 30000);
    return () => clearInterval(interval);
  }, [data?.location, altitudeShared, azimuthShared]);

  // Log errors for debugging
  useEffect(() => {
    if (error) {
      console.error("Sun state query error:", error);
    }
  }, [error]);

  // Animated style for sky background
  const skyStyle = useAnimatedStyle(() => {
    "worklet";
    const color = interpolateSkyColor(altitudeShared.value);
    return {
      flex: 1,
      backgroundColor: color,
    };
  });

  // Animated style for sun emissive color
  const sunStyle = useAnimatedStyle(() => {
    return {
      tintColor: interpolateSunColor(altitudeShared.value),
    };
  });

  const value: SunContextValue = {
    altitudeDegrees: liveAltitude,
    azimuthDegrees: liveAzimuth,
    location: data?.location ?? null,
    isReady: !isLoading && data !== undefined && liveAltitude !== null,
    altitudeShared,
    azimuthShared,
    skyStyle,
    sunStyle,
  };

  return <SunContext.Provider value={value}>{children}</SunContext.Provider>;
}

/**
 * Hook to access sun context.
 * @throws Error if used outside SunProvider
 */
export function useSunContext() {
  const context = useContext(SunContext);
  if (context === undefined) {
    throw new Error("useSunContext must be used within a SunProvider");
  }
  return context;
}
