import { useSelector, type TypedUseSelectorHook } from "react-redux"
import type { RootState } from "@/store"

/**
 * Typed useSelector hook for Redux store
 * Provides type safety when selecting state from the Redux store
 *
 * @example
 * ```typescript
 * const { user, isAuthenticated } = useAppSelector(state => state.auth)
 * const { sidebarOpen, theme } = useAppSelector(state => state.ui)
 * ```
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
