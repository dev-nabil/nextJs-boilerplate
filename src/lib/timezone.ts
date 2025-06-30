import moment from 'moment-timezone';
import timezones from '../../public/timezones.json';

// Function to find the timezone for a given city
const findTimezone = (city: string): string | null => {
  // Iterate through the timezone JSON
  for (const zone of timezones) {
    // Check if the city matches any of the `utc` entries
    if (zone.utc.some((timezone: string) => timezone.toLowerCase().includes(city.toLowerCase()))) {
      return zone.utc[0]; // Return the first matching timezone
    }
  }
  return 'UTC';
};

// Function to get local time
export const getLocalTime = (city: string): string => {
  const timezone = findTimezone(city);

  // Get current time in the found timezone
  const localTime = moment()
    .tz(timezone || 'UTC')
    .format('h:mm A');
  return localTime;
};
