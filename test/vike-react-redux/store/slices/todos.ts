import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type Todo = { text: string }
const initialState = { todoItems: [] as Todo[] }

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todoItems.push({ text: action.payload })
    },
    initializeTodos: (state, action: PayloadAction<Todo[]>) => {
      if (state.todoItems.length > 0) return
      state.todoItems = action.payload
    },
  },
  selectors: {
    selectTodos: (state) => state.todoItems,
  },
})

export const todosReducer = todosSlice.reducer
export const { selectTodos } = todosSlice.selectors
export const { addTodo, initializeTodos } = todosSlice.actions
