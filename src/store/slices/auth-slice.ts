import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AuthState, User } from "@/types/auth"

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

/**
 * Authentication slice using Redux Toolkit
 * Manages user authentication state throughout the application
 *
 * @example
 * ```typescript
 * // In a component
 * const { user, isAuthenticated } = useAppSelector(state => state.auth)
 *
 * // Dispatch actions
 * dispatch(setCredentials(user))
 * dispatch(userLogout())
 * ```
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Set user credentials after successful login
     */
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
    },

    /**
     * Set loading state during authentication
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    /**
     * Set authentication error
     */
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },

    /**
     * Clear authentication error
     */
    clearError: (state) => {
      state.error = null
    },

    /**
     * Update user profile information
     */
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },

    /**
     * Logout user and clear all authentication data
     */
    userLogout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
    },
  },
})

export const { setCredentials, setLoading, setError, clearError, updateUser, userLogout } = authSlice.actions

export default authSlice.reducer
