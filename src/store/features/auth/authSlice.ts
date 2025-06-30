import { RootState } from '@/store'
import { User } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  // TODO
  user: any | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user
      // state.token = action.payload.token
      state.isAuthenticated = true
    },
    userLogout: state => {
      state.user = null
      state.isAuthenticated = false
    }
  }
})

export const { setCredentials, userLogout } = authSlice.actions
export const authReducer = authSlice.reducer
export const selectUser = (state: RootState) => state?.auth?.user
