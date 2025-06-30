import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/store"

/**
 * Typed useDispatch hook for Redux store
 * Provides type safety when dispatching actions
 *
 * @example
 * ```typescript
 * const dispatch = useAppDispatch()
 *
 * // Dispatch actions with full type safety
 * dispatch(setCredentials({ user }))
 * dispatch(toggleSidebar())
 * ```
 */
export const useAppDispatch = () => useDispatch<AppDispatch>()
