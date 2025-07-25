"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useGoogleLoginMutation } from "@/store/api/auth-api"
import { useAppDispatch } from "@/hooks/use-app-dispatch"
import { setCredentials } from "@/store/slices/auth-slice"
import toast from "react-hot-toast"

/**
 * Google Authentication Button Component
 * Demonstrates Google OAuth integration with cookie-based authentication
 *
 * Features:
 * - Google OAuth integration
 * - Automatic token handling
 * - Error handling and user feedback
 * - RTK Query mutation integration
 *
 * @example
 * ```tsx
 * <GoogleAuthButton onSuccess={() => router.push('/dashboard')} />
 * ```
 */
interface GoogleAuthButtonProps {
  onSuccess?: () => void
  role?: "buyer" | "seller"
}

export function GoogleAuthButton({ onSuccess, role }: GoogleAuthButtonProps) {
  const dispatch = useAppDispatch()
  const [googleLogin, { isLoading }] = useGoogleLoginMutation()

  /**
   * Handle Google sign-in response
   */
  const handleGoogleSignIn = async (response: { credential?: string }) => {
    if (!response.credential) {
      console.error("No credential received from Google")
      toast.error("Google authentication failed")
      return
    }

    try {
      // Call Google login mutation
      const result = await googleLogin({
        credential: response.credential,
        role,
      }).unwrap()

      // Update Redux state
      dispatch(setCredentials({ user: result.user }))

      // Show success message
      toast.success("Successfully signed in with Google!")

      // Call success callback
      onSuccess?.()
    } catch (error: any) {
      console.error("Google login error:", error)
      toast.error(error.data?.message || "Google authentication failed")
    }
  }

  /**
   * Initialize Google OAuth
   */
  useEffect(() => {
    if (typeof window === "undefined" || !window.google) return

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleGoogleSignIn,
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      // Render the Google button
      const buttonElement = document.getElementById("google-signin-button")
      if (buttonElement) {
        window.google.accounts.id.renderButton(buttonElement, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
          shape: "rectangular",
        })
      }
    } catch (error) {
      console.error("Failed to initialize Google OAuth:", error)
    }
  }, [])

  return (
    <div className="w-full">
      {/* Google Sign-in Button Container */}
      <div id="google-signin-button" className="w-full" />

      {/* Fallback button for when Google SDK is not loaded */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isLoading}
        onClick={() => {
          if (window.google) {
            window.google.accounts.id.prompt()
          } else {
            toast.error("Google authentication is not available")
          }
        }}
        style={{ display: "none" }} // Hidden by default, shown if Google SDK fails
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>
    </div>
  )
}
