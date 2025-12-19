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
  const location = await fetchLocationFromProvider(ip);

  return {
    lat: location.lat,
    lon: location.lon,
    city: location.city,
    timezone: location.timezone,
  };
}
