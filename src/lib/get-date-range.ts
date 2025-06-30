export default function getDateRange(date?: string): string[] {
  const baseDate = date ? new Date(date) : new Date()

  // Calculate start and end dates (3 days before and 3 days after the given date)
  const startDate = new Date(baseDate)
  startDate.setDate(baseDate.getDate() - 3)

  const endDate = new Date(baseDate)
  endDate.setDate(baseDate.getDate() + 3)

  // Generate the date range array in YYYY-MM-DD format
  return generateDateRange(startDate, endDate)
}

// Helper function to generate an array of dates between two given dates
const generateDateRange = (start: Date, end: Date): string[] => {
  const dateArray: string[] = []
  const currentDate = new Date(start)

  while (currentDate <= end) {
    dateArray.push(currentDate.toISOString().slice(0, 10))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dateArray
}
