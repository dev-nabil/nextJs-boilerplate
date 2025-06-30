import { cookies } from "next/headers"
import type { APIResponse, ServerFetchOptions } from "@/types/api"

const DEFAULT_TIMEOUT = 10000 // 10 seconds
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || "http://localhost:3000"
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ""

/**
 * Enhanced server-side fetch utility with comprehensive error handling and caching
 *
 * @example
 * ```typescript
 * // Basic usage
 * const response = await serverFetch('/api/users')
 *
 * // With caching
 * const response = await serverFetch('/api/posts', {
 *   revalidate: 3600, // Cache for 1 hour
 *   tags: ['posts']
 * })
 *
 * // With custom options
 * const response = await serverFetch('/api/users', {
 *   method: 'POST',
 *   body: { name: 'John', email: 'john@example.com' },
 *   timeout: 5000
 * })
 * ```
 */
export async function serverFetch<T = any>(
  endpoint: string,
  options: ServerFetchOptions = {},
): Promise<APIResponse<T>> {
  const {
    method = "GET",
    cache = "no-store",
    revalidate,
    tags = [],
    headers = {},
    body,
    timeout = DEFAULT_TIMEOUT,
    cookies: customCookies,
    userAgent,
  } = options

  // Build the full URL
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`

  // Prepare headers
  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    ...headers,
  }

  // Add cookies for server-side requests
  try {
    const cookieStore = await cookies()
    if (customCookies) {
      requestHeaders.Cookie = customCookies
    } else if (cookieStore.toString()) {
      requestHeaders.Cookie = cookieStore.toString()
    }
  } catch (error) {
    console.warn("Failed to access cookies:", error)
  }

  // Add user agent if provided
  if (userAgent) {
    requestHeaders["User-Agent"] = userAgent
  }

  // Prepare Next.js specific options
  const nextOptions: Record<string, any> = {}

  if (tags.length > 0) {
    nextOptions.tags = tags
  }

  if (typeof revalidate === "number") {
    nextOptions.revalidate = revalidate
  }

  // Prepare fetch options
  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    ...(body && { body: typeof body === "string" ? body : JSON.stringify(body) }),
    ...(Object.keys(nextOptions).length > 0 && {
      next: nextOptions,
      cache: "force-cache",
    }),
    ...(Object.keys(nextOptions).length === 0 && { cache }),
  }

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  fetchOptions.signal = controller.signal

  try {
    const response = await fetch(url, fetchOptions)
    clearTimeout(timeoutId)

    // Handle different response types
    let data: any
    const contentType = response.headers.get("content-type")

    if (contentType?.includes("application/json")) {
      data = await response.json()
    } else if (contentType?.includes("text/")) {
      data = await response.text()
    } else {
      data = await response.blob()
    }

    // Return standardized response
    return {
      status: response.ok ? "SUCCESS" : "ERROR",
      status_code: response.status,
      data: response.ok ? data : null,
      message: response.ok ? "Request successful" : data?.message || `HTTP ${response.status}: ${response.statusText}`,
      ...(data?.errors && { errors: data.errors }),
    }
  } catch (error: any) {
    clearTimeout(timeoutId)

    // Handle different error types
    if (error.name === "AbortError") {
      return {
        status: "ERROR",
        status_code: 408,
        message: `Request timeout after ${timeout}ms`,
        data: null,
      }
    }

    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      return {
        status: "ERROR",
        status_code: 503,
        message: "Service unavailable - unable to connect to server",
        data: null,
      }
    }

    console.error(`Server fetch error for ${url}:`, error)

    return {
      status: "ERROR",
      status_code: 500,
      message: error.message || "Internal server error",
      data: null,
    }
  }
}

/**
 * Cache management utilities for server-side data fetching
 *
 * @example
 * ```typescript
 * // Revalidate specific cache tags
 * await cacheUtils.revalidateTag('posts')
 *
 * // Revalidate specific path
 * await cacheUtils.revalidatePath('/blog')
 *
 * // Get cache configuration
 * const config = cacheUtils.getCacheConfig('static')
 * ```
 */
export const cacheUtils = {
  /**
   * Revalidate specific cache tags
   */
  revalidateTag: async (tag: string) => {
    if (typeof window === "undefined") {
      const { revalidateTag } = await import("next/cache")
      revalidateTag(tag)
    }
  },

  /**
   * Revalidate specific path
   */
  revalidatePath: async (path: string, type?: "layout" | "page") => {
    if (typeof window === "undefined") {
      const { revalidatePath } = await import("next/cache")
      revalidatePath(path, type)
    }
  },

  /**
   * Get cache configuration for different data types
   */
  getCacheConfig: (type: "static" | "dynamic" | "user-specific" | "real-time") => {
    switch (type) {
      case "static":
        return { revalidate: 3600, tags: ["static"] } // 1 hour
      case "dynamic":
        return { revalidate: 300, tags: ["dynamic"] } // 5 minutes
      case "user-specific":
        return { revalidate: 60, tags: ["user"] } // 1 minute
      case "real-time":
        return { cache: "no-store" as const }
      default:
        return { cache: "no-store" as const }
    }
  },
}

/**
 * Typed server fetch with automatic error handling
 *
 * @example
 * ```typescript
 * try {
 *   const users = await typedServerFetch<User[]>('/api/users')
 *   console.log(users) // Type-safe User[] array
 * } catch (error) {
 *   console.error('Failed to fetch users:', error.message)
 * }
 * ```
 */
export async function typedServerFetch<T>(endpoint: string, options?: ServerFetchOptions): Promise<T> {
  const response = await serverFetch<T>(endpoint, options)

  if (response.status === "ERROR") {
    throw new Error(response.message || "Server request failed")
  }

  return response.data as T
}

/**
 * Server fetch with pagination support
 *
 * @example
 * ```typescript
 * const response = await paginatedServerFetch<User>('/api/users', 1, 10, {
 *   revalidate: 300,
 *   tags: ['users']
 * })
 * ```
 */
export async function paginatedServerFetch<T>(endpoint: string, page = 1, limit = 10, options?: ServerFetchOptions) {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  const url = `${endpoint}?${searchParams.toString()}`
  return serverFetch<T>(url, options)
}
