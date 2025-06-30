// features/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IConnectsState {
  connects: number
}

const initialState: IConnectsState = {
  connects: 0
}

const connectSlice = createSlice({
  name: 'connects',
  initialState,
  reducers: {
    setConnect(state, action: PayloadAction<IConnectsState>) {
      state.connects = action.payload.connects
    }
  }
})

export const { setConnect } = connectSlice.actions
export default connectSlice.reducer
