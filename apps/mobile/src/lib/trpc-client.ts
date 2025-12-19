/**
 * tRPC client instance configuration.
 */

import { httpBatchLink } from "@trpc/client";
import Constants from "expo-constants";

// Get API URL from environment or use default
const getBaseUrl = () => {
  // Priority: EXPO_PUBLIC_API_URL > app.json extra.apiUrl > default
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  const configUrl = Constants.expoConfig?.extra?.apiUrl;

  // Use environment variable first, then config, then default
  const apiUrl = envUrl || configUrl;

  if (apiUrl) {
    // Ensure the URL ends with /trpc
    return apiUrl.endsWith("/trpc") ? apiUrl : `${apiUrl}/trpc`;
  }

  // Fallback: In development, you can use localhost for simulator
  // For physical device testing with real IP detection, use Railway URL
  if (__DEV__) {
    // For iOS simulator only - use localhost
    // For physical device, set EXPO_PUBLIC_API_URL to your Railway URL
    return "http://localhost:3001/trpc";
  }

  // Production fallback
  return "http://localhost:3001/trpc";
};

export function createTRPCClient() {
  return {
    links: [
      httpBatchLink({
        url: getBaseUrl(),
      }),
    ],
  };
}
