import Link from "next/link"
import { LoginForm } from "@/features/auth/components/login-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-4">
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
