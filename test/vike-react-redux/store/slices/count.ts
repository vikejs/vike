import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = { countValue: 0 }

const countSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    increment: (state) => {
      state.countValue += 1
    },
    decrement: (state) => {
      state.countValue -= 1
    },
    initializeCount: (state, action: PayloadAction<number>) => {
      if (state.countValue !== 0) return
      state.countValue = action.payload
    },
  },
  selectors: {
    selectCount: (state) => state.countValue,
  },
})

export const countReducer = countSlice.reducer
export const { selectCount } = countSlice.selectors
export const { increment, decrement, initializeCount } = countSlice.actions
