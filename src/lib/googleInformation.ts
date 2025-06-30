export function extractCity(data: google.maps.GeocoderResult[] | google.maps.places.PlaceResult): string {
  const components =
    Array.isArray(data) && data.length > 0 ? data[0].address_components : (data as google.maps.places.PlaceResult).address_components

  if (!components) return ''

  for (const component of components) {
    if (component.types.includes('locality')) {
      return component.long_name
    }
  }

  // Fallback
  for (const component of components) {
    if (component.types.includes('administrative_area_level_1')) {
      return component.long_name
    }
  }

  return ''
}

export function extractCountry(data: google.maps.GeocoderResult[] | google.maps.places.PlaceResult): string {
  const components =
    Array.isArray(data) && data.length > 0 ? data[0].address_components : (data as google.maps.places.PlaceResult).address_components

  if (!components) return ''

  for (const component of components) {
    if (component.types.includes('country')) {
      return component.long_name
    }
  }

  return ''
}

/**
 * Fetch user location information from latitude and longitude
 * using the Google Maps Geocoding API.
 *
 * @param {number} lat - Latitude of the location
 * @param {number} lng - Longitude of the location
 * @returns {Promise<Object>} - Geocoded location information
 */
async function getUserLocationInfo(lat: number, lng: number) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status !== 'OK') {
      throw new Error(`Geocoding API returned status: ${data.status}`)
    }

    return data.results // This contains an array of location details
  } catch (error) {
    console.error('Error fetching geolocation data:', error)
    return null
  }
}

// Export the function for use in other modules
export default getUserLocationInfo
