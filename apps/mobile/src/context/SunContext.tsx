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
import type { Location } from "@sungaze/core";
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
  // Fetch sun state on mount
  const { data, isLoading, error } = trpc.sun.getInitialState.useQuery();

  // Log errors for debugging
  useEffect(() => {
    if (error) {
      console.error("Sun state query error:", error);
    }
  }, [error]);

  // Create shared value for altitude (in degrees)
  // Default to a reasonable midday altitude (30°) instead of 0° (sunrise)
  const altitudeShared = useSharedValue<number>(
    data?.sun.altitudeDegrees ?? 30
  );

  // Update shared value when data changes
  useEffect(() => {
    if (data?.sun.altitudeDegrees !== undefined) {
      altitudeShared.value = withTiming(data.sun.altitudeDegrees, {
        duration: 1000, // Smooth transition over 1 second
      });
    }
  }, [data?.sun.altitudeDegrees, altitudeShared]);

  // Animated style for sky background
  const skyStyle = useAnimatedStyle(() => {
    "worklet";
    const color = interpolateSkyColor(altitudeShared.value);
    return {
      flex: 1,
      backgroundColor: color,
    };
  });

  // Debug: Log altitude and color when data changes
  useEffect(() => {
    if (data?.sun.altitudeDegrees !== undefined) {
      console.log("Sun altitude:", data.sun.altitudeDegrees);
      // Note: interpolateSkyColor needs to be called outside worklet for logging
      // The actual color in the animated style will be correct
    }
  }, [data?.sun.altitudeDegrees]);

  // Animated style for sun emissive color
  const sunStyle = useAnimatedStyle(() => {
    return {
      // For sun, we might want to use this as a tint or shadow color
      // Adjust based on your UI needs
      tintColor: interpolateSunColor(altitudeShared.value),
    };
  });

  const value: SunContextValue = {
    altitudeDegrees: data?.sun.altitudeDegrees ?? null,
    azimuthDegrees: data?.sun.azimuthDegrees ?? null,
    location: data?.location ?? null,
    isReady: !isLoading && data !== undefined,
    altitudeShared,
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
