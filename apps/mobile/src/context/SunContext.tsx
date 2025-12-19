/**
 * Sun Context for managing sun state and location data.
 */

import React, { createContext, useContext, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { createTRPCClient } from "@/lib/trpc-client";
import type { Location } from "@sungaze/core";

interface SunContextValue {
  altitude: number | null;
  azimuth: number | null;
  location: Location | null;
  isReady: boolean;
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
  const { data, isLoading } = trpc.sun.getInitialState.useQuery();

  const value: SunContextValue = {
    altitude: data?.sun.altitude ?? null,
    azimuth: data?.sun.azimuth ?? null,
    location: data?.location ?? null,
    isReady: !isLoading && data !== undefined,
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
