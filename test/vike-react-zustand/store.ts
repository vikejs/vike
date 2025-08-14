export { useCounterStore }
export { useTodoStore }

import { create, withPageContext } from 'vike-react-zustand'
import { immer } from 'zustand/middleware/immer'
import type { Data } from './pages/index/+data'

interface CounterStore {
  counter: number
  setCounter: (value: number) => void
}
const useCounterStore = create<CounterStore>()(
  immer((set, get) => ({
    setCounter(value) {
      set((state) => {
        state.counter = value
      })
    },
    counter: Math.floor(10000 * Math.random()),
  })),
)

type Todo = { text: string }
interface TodoStore {
  todoItems: Todo[]
  addTodo: (todo: Todo) => void
}
const useTodoStore = create<TodoStore>()(
  withPageContext((pageContext) =>
    immer((set, get) => ({
      todoItems: (pageContext.data as Data).todoItemsInitial,
      addTodo(todo) {
        set((state) => {
          state.todoItems.push(todo)
        })
      },
    })),
  ),
)
