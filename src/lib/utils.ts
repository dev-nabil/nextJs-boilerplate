import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PriceSetting } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function userInitials(name: string) {
  const [firstName, lastName] = name.split(" ")
  return `${firstName.charAt(0).toUpperCase()}${lastName ? lastName?.charAt(0)?.toUpperCase() : ""}`
}

export function truncateString(str: string, maxLength: number) {
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str
}

export function getDateDifference(from: Date, to: Date): string {
  from = new Date(from)
  to = new Date(to)
  const diffInMilliseconds = to.getTime() - from.getTime() // Difference in milliseconds
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000) // Convert milliseconds to minutes
  const diffInHours = Math.floor(diffInMinutes / 60) // Convert minutes to hours
  const diffInDays = Math.floor(diffInHours / 24) // Convert hours to days

  if (diffInDays >= 1) {
    return `${diffInDays} day(s)`
  } else if (diffInHours >= 1) {
    return `${diffInHours} hour(s)`
  } else {
    return `${diffInMinutes} minute(s)`
  }
}

export function checkCharacterLimit(text: string, limit = 255) {
  const textLength = text.length

  if (textLength > limit) {
    return {
      isValid: false,
      message: `Oops! Your text is too long by ${textLength - limit} character(s).`,
      count: textLength - limit,
    }
  } else {
    return {
      isValid: true,
      message: `Great! Your text is within the limit. You have ${limit - textLength} character(s) left.`,
      count: limit - textLength,
    }
  }
}

export const serviceChecker = (item: string) => {
  if (item === "all") {
    return ["photography", "videography", "editing"]
  } else if (item === "both") {
    return ["photography", "videography"]
  } else {
    return [item]
  }
}

export const calculateProfileCompletion = (user: any) => {
  const baseUser = user

  const fields = [
    // baseUser?.user?.name,
    // baseUser?.aboutMe,
    baseUser?.user?.address,
    // baseUser?.emailVerified,
    // baseUser?.phoneVerified,
    user?.categories?.length > 0,
    user?.certifications?.length > 0,
    user?.experiences?.length > 0,
    // user?.personalProjects?.length > 0,
    user?.nid,
    user?.title,
    user?.cover,
    user?.description,
    // user?.socialMediaLinks
  ]

  const completedFields = fields.filter(Boolean).length
  const totalFields = fields.length

  return Math.round((completedFields / totalFields) * 100)
}

export function getDaysDifference(startDate: any, endDate: any) {
  // Convert the date strings to Date objects
  const start: any = new Date(startDate)
  const end: any = new Date(endDate)

  // Calculate the difference in milliseconds
  const diffInMs = end - start

  // Convert milliseconds to days
  const daysDifference = `${Math.floor(diffInMs / (1000 * 60 * 60 * 24))} days`

  return daysDifference
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function generateId(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2)
}

export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function camelToKebab(str: string) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase()
}

export function kebabToCamel(str: string) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand("copy")
    } catch (err) {
      console.error("Unable to copy to clipboard", err)
    }
    document.body.removeChild(textArea)
    return Promise.resolve()
  }
}

export function downloadFile(data: any, filename: string, type = "application/json") {
  const file = new Blob([data], { type })
  const a = document.createElement("a")
  const url = URL.createObjectURL(file)
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export function getRandomColor() {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type UploadFileOptions = {
  url: string
  method?: "POST" | "PUT" | "PATCH" // Default to 'POST'
  data: any // Single file or array of files
  fileName: string // Optional file name
  onProgress?: (progress: number, timeLeft?: string) => void // Optional progress callback
}
type fileType = {
  name: string
  file: File
}

function transformDataFormat(data: any) {
  const { file, ...rest } = data
  return rest
}

const date = new Date()
export const currentMonth = String(date.getMonth() + 1).padStart(2, "0") // Ensure 2 digits (e.g., "01", "02", ..., "09")
export const currentYear = date.getFullYear() // Get the current year
export const availableYears = Array.from({ length: currentYear - 2023 + 1 }, (_, i) => 2023 + i).reverse() // Generate years from 2023 to current year + 1

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
]

// Generate months array up to the current month
export const availableMonths = (year?: number) => {
  if (year === currentYear) {
    return months.slice(0, Number(currentMonth))
  }
  return months
}

// Helper function to format time in "mm:ss" format
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}m ${remainingSeconds}s`
}

export const uploadFileWithProgress = ({
  url,
  method = "POST",
  data,
  fileName = "file",
  onProgress,
}: UploadFileOptions): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    if (!data) {
      reject(new Error("No data provided."))
      return
    }

    const formData = new FormData()
    const updatedData = transformDataFormat(data)

    // Handle both single and multiple files
    if (Array.isArray(data.file)) {
      data.file.forEach((f: fileType) => {
        formData.append(f.name, f.file)
      })
    } else {
      formData.append(fileName, data.file)
    }

    // Add additional data as JSON
    if (updatedData && Object.keys(updatedData).length > 0) {
      formData.append("data", JSON.stringify(updatedData))
    }

    const xhr = new XMLHttpRequest()
    const startTime = Date.now()
    let previousLoaded = 0

    // Attach upload progress listener
    xhr.upload.addEventListener("progress", (e) => {
      if (onProgress) {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100)

          const elapsedTime = (Date.now() - startTime) / 1000 // Time in seconds
          const uploaded = e.loaded
          const total = e.total

          // Calculate upload speed (bytes per second)
          const uploadSpeed = (uploaded - previousLoaded) / elapsedTime // Bytes/sec
          previousLoaded = uploaded

          // Estimate time left (in seconds)
          const timeLeftSeconds = Math.max((total - uploaded) / uploadSpeed, 0)

          // Format time left as "mm:ss"
          const timeLeftFormatted = formatTime(timeLeftSeconds)

          onProgress(percentComplete, timeLeftFormatted) // Call the progress callback
        } else {
          // Handle the case where length is not computable
          console.warn("Length not computable. Progress will be estimated.")
          onProgress(-1) // Pass -1 to indicate indeterminate progress
        }
      }
    })

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.response) // Assuming the response is JSON
          resolve(response)
        } catch {
          resolve([xhr.response]) // Return raw response if not JSON
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    }

    xhr.onerror = () => {
      reject(new Error("An error occurred during the upload."))
    }

    // Open and configure the request
    xhr.open(method, `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`)
    xhr.withCredentials = true // Include cookies in the request
    xhr.setRequestHeader("x-api-key", process.env.NEXT_PUBLIC_API_KEY as string)

    // Send the form data
    xhr.send(formData)
  })
}

export function priceTime(text: "hourly" | "milestoneBased" | "projectBased") {
  switch (text) {
    case "hourly":
      return "hr"
    case "milestoneBased":
      return "milestone"
    case "projectBased":
      return "fix"

    default:
      return "fix"
  }
}

export function formatRelativeTime(dateString: string) {
  const now: any = new Date()
  const past: any = new Date(dateString)
  const diff = now - past

  if (diff <= 0) {
    return "just now"
  }

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (minutes < 1) {
    return "just now"
  } else if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else if (days === 1) {
    return `1 day ago`
  } else if (days < 30) {
    return `${days} days ago`
  } else if (days < 365) {
    const remainingDays = days % 30
    return `${months}mo ${remainingDays}d ago`
  } else {
    const remainingDays = days % 365
    return `${years}y ${remainingDays}d ago`
  }
}

export const youtubeIdGet = (url: string) => {
  if (url.includes("youtube.com")) {
    const splited = url.split("v=")
    const splitedAgain = splited[1]?.split("&")
    const videoId = splitedAgain ? splitedAgain[0] : ""
    return `https://www.youtube.com/embed/${videoId}`
  } else if (url.includes("youtu.be")) {
    const videoId = url.split("/").pop()
    return `https://www.youtube.com/embed/${videoId}`
  } else {
    return url // Return the original URL if it's not a YouTube link
  }
}

// sorting the status base show data function
export function sortByStatus(arr: any[] = []): any[] {
  const order: Record<string, number> = {
    // ended: 0,
    active: 1,
    pending: 2,
  }

  return [...arr].sort((a, b) => {
    const statusA = order[a?.status] ?? Number.MAX_SAFE_INTEGER
    const statusB = order[b?.status] ?? Number.MAX_SAFE_INTEGER
    return statusA - statusB
  })
}

// Encode a string using Base64
export function encodeBase64(data: any) {
  try {
    // Convert the string to a UTF-8 encoding and then Base64 encode it
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))))
  } catch (e) {
    console.error("Encoding failed: ", e)
    return null
  }
}

// ==============Decode a Base64 encoded string===================
export function decodeBase64(encodedData: any) {
  try {
    // First, decode the Base64 encoded string into a raw string
    const decodedString = atob(encodedData)

    // If the decoded string is a valid JSON, parse it. Otherwise, return the decoded string.
    // Only apply JSON.parse if the decoded string is in JSON format
    try {
      return JSON.parse(decodedString) // Try parsing as JSON
    } catch (jsonError) {
      // If it's not valid JSON, just return the plain decoded string
      return decodedString
    }
  } catch (e) {
    console.error("Decoding failed: ", e)
    return null
  }
}

// ===========Example usage: =========

// Encode object to Base64
// const encodedData = encodeBase64(JSON.stringify(originalData));
// console.log('Encoded:', encodedData);

// // Decode Base64 to original object
// const decodedData = decodeBase64(encodedData);
// console.log('Decoded:', decodedData);

// ==============Decode a Base64 encoded end===================

// user location in localstroage get and usr curent location
export const getUserLocationName = (): string | null => {
  try {
    const cachedLocation = localStorage.getItem("userLocation")
    if (cachedLocation) {
      const location = JSON.parse(cachedLocation)
      const locationName = location.locationName
      return locationName
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

// user location in localstroage get and usr curent location
const priceSetting: PriceSetting = {
  minPrice: 100,
  maxPrice: 9999999
}

export const validateStepFields = async (fields: string[], trigger: any): Promise<boolean> => {
  return await trigger(fields as any, { shouldFocus: true })
}

export const validateSubCategories = (
  currentStep: number,
  categoryData: any,
  subCategories: any[],
  setError: any,
  clearErrors: any
): boolean => {
  if (currentStep === 1) {
    if (categoryData?.value && (!subCategories || subCategories.length === 0)) {
      setError('subCategories', {
        type: 'manual',
        message: 'At least one skill is required'
      })
      return false
    } else {
      clearErrors('subCategories')
    }
  }
  return true
}
export const validateHourlyRates = (
  minAmount: number,
  maxAmount: number,
  setError: any,
  clearErrors: any,
  validateNumericInput: any
): boolean => {
  let valid = true
  clearErrors('fixedAmount')

  const { minPrice, maxPrice } = priceSetting

  if (minAmount < minPrice) {
    setError('minAmount', { type: 'manual', message: `Minimum price must be at least ${formatPrice(minPrice)}` })
    valid = false
  } else if (!validateNumericInput(minAmount)) {
    setError('minAmount', { type: 'manual', message: 'Please enter a valid positive number' })
    valid = false
  } else if (minAmount > maxPrice) {
    setError('minAmount', { type: 'manual', message: `Minimum price must not exceed ${formatPrice(maxPrice)}` })
    valid = false
  } else {
    clearErrors('minAmount')
  }

  if (maxAmount < minPrice) {
    setError('maxAmount', { type: 'manual', message: `Maximum price must be at least ${formatPrice(minPrice)}` })
    valid = false
  } else if (!validateNumericInput(maxAmount)) {
    setError('maxAmount', { type: 'manual', message: 'Please enter a valid positive number' })
    valid = false
  } else if (maxAmount > maxPrice) {
    setError('maxAmount', { type: 'manual', message: `Maximum price must not exceed ${formatPrice(maxPrice)}` })
    valid = false
  } else if (minAmount >= maxAmount) {
    setError('maxAmount', { type: 'manual', message: 'Maximum must be greater than minimum' })
    valid = false
  } else if (minAmount >= maxAmount) {
    setError('maxAmount', { type: 'manual', message: 'Maximum must be greater than minimum' })
    valid = false
  } else {
    clearErrors('maxAmount')
  }

  return valid
}

export const validateFixedAmount = (fixedAmount: number, setError: any, clearErrors: any, validateNumericInput: any): boolean => {
  clearErrors(['minAmount', 'maxAmount'])

  const { minPrice, maxPrice } = priceSetting

  if (fixedAmount < minPrice) {
    setError('fixedAmount', { type: 'manual', message: `Fixed amount must be at least ${formatPrice(minPrice)}` })
    return false
  } else if (!validateNumericInput(fixedAmount)) {
    setError('fixedAmount', { type: 'manual', message: 'Please enter a valid positive number' })
    return false
  } else if (fixedAmount > maxPrice) {
    setError('fixedAmount', { type: 'manual', message: `Fixed amount must not exceed ${formatPrice(maxPrice)}` })
    return false
  } else {
    clearErrors('fixedAmount')
  }

  return true
}
