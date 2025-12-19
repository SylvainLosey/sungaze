/**
 * Application configuration constants.
 * Centralized configuration for API endpoints and environment settings.
 */

import Constants from "expo-constants";

/**
 * Production API base URL
 */
const PRODUCTION_API_URL = "https://api.sungaze.com";

/**
 * Development API base URL (for iOS simulator)
 */
const DEVELOPMENT_API_URL = "http://localhost:3001";

/**
 * Gets the API base URL from environment variables or defaults.
 * Priority: EXPO_PUBLIC_API_URL > app.json extra.apiUrl > environment default
 *
 * @returns The API base URL (without trailing slash)
 */
function getApiBaseUrl(): string {
  // Check environment variable first (highest priority)
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, ""); // Remove trailing slash
  }

  // Check app.json config
  const configUrl = Constants.expoConfig?.extra?.apiUrl;
  if (configUrl) {
    return configUrl.replace(/\/$/, ""); // Remove trailing slash
  }

  // Default based on environment
  if (__DEV__) {
    return DEVELOPMENT_API_URL;
  }

  return PRODUCTION_API_URL;
}

/**
 * API base URL - use this constant throughout the app.
 * Automatically resolves based on environment and configuration.
 */
export const API_BASE_URL = getApiBaseUrl();

/**
 * Full tRPC endpoint URL
 */
export const API_TRPC_URL = `${API_BASE_URL}/trpc`;



