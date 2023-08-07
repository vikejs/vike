/*
 * @Descripttion: 
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2023-08-04 17:39:02
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-07 15:45:42
 */
import { defineStore } from 'pinia'

export const useTodos = defineStore('todos', {
  state: () => ({
    todoList: []
  }),
  getters: {
    todoById: (state) => (id) => state.todoList.find((todo) => todo.id === id)
  },
  actions: {
    async fetchTodoList() {
      // simulate an API response
      const result = await new Promise((resolve) => setTimeout(() => resolve(todos), 250))
      this.todoList = result
    },
    async fetchTodoById(id) {
      const result = await new Promise((resolve) => setTimeout(() => resolve(todos.find((todo) => todo.id === id))))
      this.todoList = [result]
    }
  }
})

const todos = [
  {
    id: 0,
    text: 'Buy milk'
  },
  {
    id: 1,
    text: 'Buy chocolate'
  }
]
