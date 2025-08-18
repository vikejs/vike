import { defineStore } from 'pinia'
import { ref } from 'vue'

type Todo = {
  text: string
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])

  const addTodos = (todo: Todo[]) => {
    todos.value.push(...todo)
  }

  const initTodos = (todosInit: Todo[]) => {
    if (todos.value.length !== 0) return
    todos.value = todosInit
  }

  return { todos, addTodos, initTodos }
})
