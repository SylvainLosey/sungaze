/**
 * tRPC client instance configuration.
 */

import { httpBatchLink } from "@trpc/client";
import Constants from "expo-constants";

// Get API URL from environment or use default
const getBaseUrl = () => {
  // In development, use localhost
  // In production, use your API URL
  if (__DEV__) {
    // For iOS simulator, use localhost
    // For Android emulator, use 10.0.2.2
    // For physical device, use your computer's IP
    return "http://localhost:3001/trpc";
  }
  // In production, use your actual API URL
  return Constants.expoConfig?.extra?.apiUrl || "http://localhost:3001/trpc";
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
