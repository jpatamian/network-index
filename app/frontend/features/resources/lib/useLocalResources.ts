import { useState, useEffect } from "react";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org";
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export interface LocalResource {
  id: string;
  name: string;
  category: string;
  address?: string;
  phone?: string;
  website?: string;
  hours?: string;
  lat: number;
  lon: number;
  distanceMiles?: number;
}

function categorize(tags: Record<string, string>): string {
  const amenity = tags.amenity;
  const sf = tags["social_facility"];

  if (amenity === "food_bank" || sf === "food_bank" || sf === "soup_kitchen")
    return "Food";
  if (amenity === "shelter" || sf === "shelter" || sf === "housing")
    return "Housing & Shelter";
  if (sf === "healthcare" || sf === "clinic" || sf === "hospice")
    return "Healthcare";
  if (amenity === "community_centre") return "Community Center";
  return "Social Services";
}

function buildAddress(tags: Record<string, string>): string | undefined {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:city"],
    tags["addr:state"],
  ].filter(Boolean);
  return parts.length ? parts.join(" ") : undefined;
}

function haversineMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocodeZipcode(
  zipcode: string,
): Promise<{ lat: number; lon: number } | null> {
  const url = `${NOMINATIM_URL}/search?postalcode=${encodeURIComponent(zipcode)}&countrycodes=us&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "MutualAidClub/1.0" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

async function queryOverpass(
  lat: number,
  lon: number,
  radiusMiles: number = 20,
): Promise<LocalResource[]> {
  const radius = radiusMiles * 1609.34; // Convert miles to meters
  const query = `
[out:json][timeout:25];
(
  node["amenity"~"^(social_facility|food_bank|shelter|community_centre)$"](around:${radius},${lat},${lon});
  way["amenity"~"^(social_facility|food_bank|shelter|community_centre)$"](around:${radius},${lat},${lon});
);
out center 80 qt;
`.trim();

  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) return [];

  const data = await res.json();

  return (data.elements ?? [])
    .filter((el: Record<string, unknown>) => {
      const tags = el.tags as Record<string, string> | undefined;
      return tags?.name;
    })
    .map((el: Record<string, unknown>) => {
      const tags = el.tags as Record<string, string>;
      const elLat =
        el.type === "way"
          ? (el.center as { lat: number }).lat
          : (el.lat as number);
      const elLon =
        el.type === "way"
          ? (el.center as { lon: number }).lon
          : (el.lon as number);

      return {
        id: `${el.type}-${el.id}`,
        name: tags.name,
        category: categorize(tags),
        address: buildAddress(tags),
        phone: tags.phone ?? tags["contact:phone"],
        website: tags.website ?? tags["contact:website"],
        hours: tags.opening_hours,
        lat: elLat,
        lon: elLon,
        distanceMiles: haversineMiles(lat, lon, elLat, elLon),
      } satisfies LocalResource;
    })
    .sort(
      (a: LocalResource, b: LocalResource) =>
        (a.distanceMiles ?? 99) - (b.distanceMiles ?? 99),
    );
}

export function useLocalResources(zipcode: string, radiusMiles: number = 20) {
  const [resources, setResources] = useState<LocalResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!zipcode) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setResources([]);

    (async () => {
      try {
        const coords = await geocodeZipcode(zipcode);
        if (cancelled) return;
        if (!coords) {
          setError(
            "Couldn't find that zipcode. Please double-check and try again.",
          );
          setIsLoading(false);
          return;
        }

        const results = await queryOverpass(
          coords.lat,
          coords.lon,
          radiusMiles,
        );
        if (!cancelled) {
          setResources(results);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load local resources. Please try again.");
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [zipcode, radiusMiles]);

  return { resources, isLoading, error };
}
