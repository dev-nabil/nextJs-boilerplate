"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLoginMutation } from "@/store/api/auth-api"
import { useAppDispatch } from "@/hooks/use-app-dispatch"
import { setCredentials } from "@/store/slices/auth-slice"
import { GoogleAuthButton } from "./google-auth-button"

/**
 * Login form validation schema
 */
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

/**
 * Login Form Component
 * Demonstrates form handling, validation, and RTK Query mutations
 *
 * Features:
 * - Form validation with Zod
 * - RTK Query mutation for login
 * - Loading states and error handling
 * - Password visibility toggle
 * - Google authentication integration
 * - Smooth animations with Framer Motion
 *
 * @example
 * ```tsx
 * <LoginForm onSuccess={() => router.push('/dashboard')} />
 * ```
 */
interface LoginFormProps {
  onSuccess?: () => void
  className?: string
}

export function LoginForm({ onSuccess, className }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useAppDispatch()

  // RTK Query mutation hook
  const [login, { isLoading }] = useLoginMutation()

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  /**
   * Handle form submission
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      // Call login mutation
      const response = await login({
        ...data,
        provider: "credentials",
      }).unwrap()

      // Update Redux state
      dispatch(setCredentials({ user: response.user }))

      // Show success message
      toast.success("Login successful! Welcome back.")

      // Call success callback
      onSuccess?.()
    } catch (error: any) {
      console.error("Login error:", error)

      // Handle different error types
      if (error.status === 401) {
        setError("root", { message: "Invalid email or password" })
      } else if (error.status === 429) {
        setError("root", { message: "Too many login attempts. Please try again later." })
      } else {
        setError("root", {
          message: error.data?.message || "Login failed. Please try again.",
        })
      }

      toast.error(error.data?.message || "Login failed")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Google Authentication */}
          <GoogleAuthButton onSuccess={onSuccess} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-sm text-destructive"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-sm text-destructive"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Form Error */}
            {errors.root && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
              >
                {errors.root.message}
              </motion.div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Additional Links */}
          <div className="text-center text-sm">
            <a href="/auth/forgot-password" className="text-primary hover:underline">
              Forgot your password?
            </a>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/auth/register" className="text-primary hover:underline font-medium">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
