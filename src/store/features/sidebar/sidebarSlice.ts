import { RootState } from '@/store'
import { createSlice } from '@reduxjs/toolkit'

interface SidebarState {
  isMinimized: boolean
}

const initialState: SidebarState = {
  isMinimized: false
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggle: state => {
      state.isMinimized = !state.isMinimized
    }
  }
})

export const selectIsMinimized = (state: RootState) => state.sidebar.isMinimized

export const { toggle } = sidebarSlice.actions
export const sidebarReducer = sidebarSlice.reducer
