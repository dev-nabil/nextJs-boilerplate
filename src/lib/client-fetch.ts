import type { APIResponse, FetchOptions } from "@/types/api"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || ""
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ""

/**
 * Enhanced client-side fetch utility
 */
export async function clientFetch<T = any>(endpoint: string, options: FetchOptions = {}): Promise<APIResponse<T>> {
  const { method = "GET", headers = {}, body, timeout = 10000 } = options

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    ...headers,
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      credentials: "include",
      signal: controller.signal,
      ...(body && { body: typeof body === "string" ? body : JSON.stringify(body) }),
    })

    clearTimeout(timeoutId)

    const data = await response.json()

    return {
      status: response.ok ? "SUCCESS" : "ERROR",
      status_code: response.status,
      data: response.ok ? data : null,
      message: response.ok ? "Request successful" : data?.message || "Request failed",
    }
  } catch (error: any) {
    clearTimeout(timeoutId)

    return {
      status: "ERROR",
      status_code: error.name === "AbortError" ? 408 : 500,
      message: error.name === "AbortError" ? "Request timeout" : error.message,
      data: null,
    }
  }
}
