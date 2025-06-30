"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "@/store"

/**
 * Redux Store Provider Component
 * Wraps the application with Redux store context
 *
 * @example
 * ```tsx
 * <StoreProvider>
 *   <App />
 * </StoreProvider>
 * ```
 */
interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>
}
