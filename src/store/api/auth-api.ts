import { api } from "../api"
import type { LoginCredentials, RegisterData, AuthResponse, User } from "@/types/auth"

/**
 * Authentication API endpoints using RTK Query
 * Handles all authentication-related API calls
 *
 * @example
 * ```typescript
 * // Login
 * const [login, { isLoading }] = useLoginMutation()
 * await login({ email, password })
 *
 * // Register
 * const [register] = useRegisterMutation()
 * await register({ name, email, password, role })
 *
 * // Get profile
 * const { data: profile } = useGetProfileQuery()
 * ```
 */
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Login with email and password
     */
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    /**
     * Register new user account
     */
    register: builder.mutation<AuthResponse, RegisterData>({
      query: (userData) => ({
        url: "/api/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    /**
     * Google OAuth login
     */
    googleLogin: builder.mutation<AuthResponse, { credential: string; role?: string }>({
      query: (data) => ({
        url: "/api/auth/google",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    /**
     * Logout current user
     */
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    /**
     * Get current user profile
     */
    getProfile: builder.query<User, void>({
      query: () => "/api/auth/profile",
      providesTags: ["User"],
    }),

    /**
     * Update user profile
     */
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (updates) => ({
        url: "/api/auth/profile",
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: ["User"],
    }),

    /**
     * Refresh authentication token
     */
    refreshToken: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/api/auth/refresh",
        method: "POST",
      }),
    }),

    /**
     * Send OTP for verification
     */
    sendOtp: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/api/auth/send-otp",
        method: "POST",
        body: data,
      }),
    }),

    /**
     * Verify OTP
     */
    verifyOtp: builder.mutation<AuthResponse, { email: string; otp: string }>({
      query: (data) => ({
        url: "/api/auth/verify-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useRefreshTokenMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} = authApi
