import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { userLogout } from "./slices/auth-slice"

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"

/**
 * Base query configuration with automatic token refresh
 * This handles authentication and token refresh automatically
 */
const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY
    if (apiKey) {
      headers.set("x-api-key", apiKey)
    }
    headers.set("Content-Type", "application/json")
    return headers
  },
})

/**
 * Enhanced base query with automatic authentication handling
 * Automatically refreshes tokens and handles logout on auth failure
 */
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions)

  // Handle 401 Unauthorized responses
  if (result.error && result.error.status === 401) {
    console.log("Token expired, attempting refresh...")

    // Try to refresh the token
    const refreshResult = await baseQuery("/api/auth/refresh", api, extraOptions)

    if (refreshResult.data) {
      console.log("Token refreshed successfully")
      // Retry the original query
      result = await baseQuery(args, api, extraOptions)
    } else {
      console.log("Token refresh failed, logging out")
      // Dispatch logout action
      api.dispatch(userLogout())

      // Redirect to login if we're in the browser
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login"
      }
    }
  }

  return result
}

/**
 * Main API slice using RTK Query
 * This is the central API configuration for the entire application
 *
 * @example
 * ```typescript
 * // In a component
 * const { data: users, isLoading, error } = useGetUsersQuery()
 *
 * // With mutation
 * const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
 * ```
 */
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Auth",
    "Project",
    "Category",
    "Subscription",
    "Admin",
    "Analytics",
    "Notification",
    "Post",
    "Comment",
    "Demo",
  ],
  endpoints: () => ({}),
})

// Export hooks for usage in functional components
export const {
  // These will be generated automatically by RTK Query
  // when you define endpoints in separate API slices
} = api
