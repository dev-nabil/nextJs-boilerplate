"use client"

import type React from "react"

import { Toaster } from "react-hot-toast"
import { StoreProvider } from "./store-provider"
import { ThemeProvider } from "./theme-provider"

/**
 * Root Providers Component
 * Combines all application providers in the correct order
 *
 * @example
 * ```tsx
 * <Providers>
 *   <App />
 * </Providers>
 * ```
 */
interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <StoreProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "hsl(var(--background))",
              color: "hsl(var(--foreground))",
              border: "1px solid hsl(var(--border))",
            },
          }}
        />
      </ThemeProvider>
    </StoreProvider>
  )
}
