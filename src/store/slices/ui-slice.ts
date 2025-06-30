import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UIState {
  sidebarOpen: boolean
  theme: "light" | "dark" | "system"
  loading: boolean
  notifications: Array<{
    id: string
    type: "success" | "error" | "warning" | "info"
    title: string
    message: string
    timestamp: number
  }>
}

const initialState: UIState = {
  sidebarOpen: false,
  theme: "system",
  loading: false,
  notifications: [],
}

/**
 * UI slice for managing application UI state
 *
 * @example
 * \`\`\`typescript
 * // Toggle sidebar
 * dispatch(toggleSidebar())
 *
 * // Change theme
 * dispatch(setTheme('dark'))
 *
 * // Add notification
 * dispatch(addNotification({
 *   type: 'success',
 *   title: 'Success',
 *   message: 'Operation completed successfully'
 * }))
 * \`\`\`
 */
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    addNotification: (
      state,
      action: PayloadAction<{
        type: "success" | "error" | "warning" | "info"
        title: string
        message: string
      }>,
    ) => {
      const notification = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: Date.now(),
      }
      state.notifications.push(notification)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions

export default uiSlice.reducer
