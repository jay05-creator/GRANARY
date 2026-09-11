/**
 * OpenStreetMap Nominatim Geocoding utility for Granary.
 * Resolves address text and city in the Nashik harvest belt to accurate
 * latitude and longitude coordinates for map pin placement, and validates
 * whether the address is legitimate or unverified.
 */

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
  isValid: boolean;
  source: "nominatim" | "city_fallback";
  warning?: string;
}

/** Fallback coordinates for major towns/hubs in Nashik district & harvest belt */
export const NASHIK_BELT_CITIES: Record<string, { lat: number; lng: number }> = {
  Niphad: { lat: 20.0797, lng: 74.1106 },
  Mohadi: { lat: 20.0194, lng: 73.8702 },
  Dindori: { lat: 20.2036, lng: 73.8311 },
  Nashik: { lat: 19.9975, lng: 73.7898 },
  Lasalgaon: { lat: 20.1426, lng: 74.2326 },
  Pimpalgaon: { lat: 20.1648, lng: 73.9921 },
  Sinnar: { lat: 19.8458, lng: 73.9961 },
  Igatpuri: { lat: 19.6957, lng: 73.5626 },
  Kopargaon: { lat: 19.8854, lng: 74.4761 },
};

/**
 * Geocode an address string + city to precise lat/lng and evaluate legitimacy.
 * Uses Nominatim API (https://nominatim.openstreetmap.org/search).
 */
export async function geocodeAddress(
  address: string,
  city: string,
): Promise<GeocodeResult> {
  const cleanAddress = address.trim();
  const cleanCity = city.trim();

  // Basic sanity check: nonsense inputs with no letters/spaces
  if (!cleanAddress || cleanAddress.length < 3) {
    const cityMatch = NASHIK_BELT_CITIES[cleanCity] || NASHIK_BELT_CITIES.Nashik;
    return {
      lat: cityMatch.lat,
      lng: cityMatch.lng,
      displayName: `${cleanCity}, Nashik Belt`,
      isValid: false,
      source: "city_fallback",
      warning: "Please enter a specific street address.",
    };
  }

  const queryParts = [cleanAddress, cleanCity, "Nashik", "Maharashtra", "India"]
    .filter(Boolean)
    .join(", ");

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      queryParts,
    )}&limit=1`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Granary-App/1.0 (Agricultural Storage Network)",
        "Accept-Language": "en",
      },
    });

    if (res.ok) {
      const data = (await res.json()) as Array<{
        lat: string;
        lon: string;
        display_name?: string;
      }>;

      if (data && data.length > 0) {
        const parsedLat = Number.parseFloat(data[0].lat);
        const parsedLng = Number.parseFloat(data[0].lon);

        if (!Number.isNaN(parsedLat) && !Number.isNaN(parsedLng)) {
          return {
            lat: Number(parsedLat.toFixed(5)),
            lng: Number(parsedLng.toFixed(5)),
            displayName: data[0].display_name || queryParts,
            isValid: true,
            source: "nominatim",
          };
        }
      }
    }
  } catch (err) {
    console.warn("[geocoding] Nominatim query failed, using city fallback:", err);
  }

  // Address was NOT verified by Nominatim (0 results or request failed)
  const cityMatch =
    NASHIK_BELT_CITIES[cleanCity] ||
    NASHIK_BELT_CITIES.Nashik || { lat: 20.08, lng: 74.11 };

  // Deterministic offset based on address text so unverified pins don't stack directly
  const hash = cleanAddress
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const latOffset = ((hash % 30) - 15) * 0.0008;
  const lngOffset = (((hash * 7) % 30) - 15) * 0.0008;

  return {
    lat: Number((cityMatch.lat + latOffset).toFixed(5)),
    lng: Number((cityMatch.lng + lngOffset).toFixed(5)),
    displayName: `${cleanAddress}, ${cleanCity} (Unverified Address)`,
    isValid: false,
    source: "city_fallback",
    warning: `Could not locate "${cleanAddress}" on OpenStreetMap. Please check for typos or add a nearby landmark.`,
  };
}
