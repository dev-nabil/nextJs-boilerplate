"use client"

import { useAppSelector } from "./use-app-selector"

/**
 * Custom hook for accessing authentication state
 * Provides easy access to user authentication information
 *
 * @example
 * ```typescript
 * const { user, isAuthenticated, isLoading } = useAuth()
 *
 * if (isLoading) return <LoadingSpinner />
 * if (!isAuthenticated) return <LoginForm />
 *
 * return <Dashboard user={user} />
 * ```
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth)

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    // Computed properties
    isAdmin: user?.role === "admin",
    isBuyer: user?.role === "buyer",
    isSeller: user?.role === "seller",
    isVerified: user?.verified ?? false,
  }
}
