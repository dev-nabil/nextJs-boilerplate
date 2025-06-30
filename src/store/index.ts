import { configureStore } from "@reduxjs/toolkit"
import { api } from "./api"
import authReducer from "./slices/auth-slice"
import uiReducer from "./slices/ui-slice"

/**
 * Redux store configuration
 * Combines all reducers and middleware for the application
 *
 * @example
 * ```typescript
 * // In your app
 * import { store } from '@/store'
 * import { Provider } from 'react-redux'
 *
 * <Provider store={store}>
 *   <App />
 * </Provider>
 * ```
 */
export const store = configureStore({
  reducer: {
    // API slice reducer
    [api.reducerPath]: api.reducer,
    // Feature reducers
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore these action types
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
