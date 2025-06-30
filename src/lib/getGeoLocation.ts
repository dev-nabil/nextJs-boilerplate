export async function getGeoLocation(): Promise<string> {
  const cacheKey = "geo-location";
  const cacheTimestampKey = "geo-location-timestamp";
  const cachedData = localStorage.getItem(cacheKey);
  const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;

  if (cachedData && cachedTimestamp && now - parseInt(cachedTimestamp) < twentyFourHours) {
    return cachedData;
  }

  try {
    const res = await fetch("/api/geolocation");
    const geo = await res.json();

    const result = JSON.stringify({
      country: geo.country,
      city: geo.city,
      latitude: geo.latitude,
      longitude: geo.longitude
    });

    localStorage.setItem(cacheKey, result);
    localStorage.setItem(cacheTimestampKey, now.toString());

    return result;
  } catch {
    return cachedData ?? "";
  }
}
