import { defineStore } from 'pinia'

export const useTodos = defineStore('todos', {
  state: () => ({
    todoList: [],
  }),
  getters: {
    todoById: (state) => (id) => state.todoList.find((todo) => todo.id === id),
  },
  actions: {
    async fetchTodoList() {
      // simulate an API response
      const result = await new Promise((resolve) =>
        setTimeout(() => {
          resolve([
            {
              id: 0,
              text: 'Buy milk',
            },
            {
              id: 1,
              text: 'Buy chocolate',
            },
          ])
        }, 250),
      )
      this.todoList = result
    },
  },
})
