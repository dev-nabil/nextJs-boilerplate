import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ThemeState {
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

const initialState: ThemeState = {
  primaryColor: '#0070f3',
  secondaryColor: '#00b4d8',
  accentColor: '#ef4444'
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload
    },
    setSecondaryColor: (state, action: PayloadAction<string>) => {
      state.secondaryColor = action.payload
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload
    }
  }
})

export const { setPrimaryColor, setSecondaryColor, setAccentColor } = themeSlice.actions
export const themeReducer = themeSlice.reducer
