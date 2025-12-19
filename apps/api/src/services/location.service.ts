/**
 * Location service for retrieving location data from IP addresses.
 * Abstracts the IP geolocation provider to allow easy replacement.
 */

interface LocationProviderResponse {
  lat: number;
  lon: number;
  city: string;
  timezone: string;
}

interface LocationData {
  lat: number;
  lon: number;
  city: string;
  timezone: string;
}

/**
 * Fetches location data from IP using the configured provider.
 * Currently uses ip-api.com, but can be easily replaced.
 */
async function fetchLocationFromProvider(
  ip: string
): Promise<LocationProviderResponse> {
  const response = await fetch(`http://ip-api.com/json/${ip}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch location data: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.status === "fail") {
    throw new Error(
      `IP geolocation failed: ${data.message || "Unknown error"}`
    );
  }

  return {
    lat: data.lat,
    lon: data.lon,
    city: data.city,
    timezone: data.timezone,
  };
}

/**
 * Gets location information from an IP address.
 * @param ip - The IP address to look up
 * @returns Location data including latitude, longitude, city, and timezone
 */
export async function getLocationFromIp(ip: string): Promise<LocationData> {
  // Handle localhost/private IPs with a default location (Zurich)
  const isLocalhost =
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "::ffff:127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.20.") ||
    ip.startsWith("172.21.") ||
    ip.startsWith("172.22.") ||
    ip.startsWith("172.23.") ||
    ip.startsWith("172.24.") ||
    ip.startsWith("172.25.") ||
    ip.startsWith("172.26.") ||
    ip.startsWith("172.27.") ||
    ip.startsWith("172.28.") ||
    ip.startsWith("172.29.") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.");

  if (isLocalhost) {
    // Default to Zurich, Switzerland for localhost
    return {
      lat: 47.3769,
      lon: 8.5417,
      city: "Zurich",
      timezone: "Europe/Zurich",
    };
  }

  try {
    const location = await fetchLocationFromProvider(ip);
    return {
      lat: location.lat,
      lon: location.lon,
      city: location.city,
      timezone: location.timezone,
    };
  } catch (error) {
    // Fallback to Zurich if IP lookup fails
    console.error(`Failed to get location for IP ${ip}:`, error);
    return {
      lat: 47.3769,
      lon: 8.5417,
      city: "Zurich",
      timezone: "Europe/Zurich",
    };
  }
}
