export { getTodoItems }
export { addTodoItem }
export { resetTodoItems }
export { TodoListDurableObject }
export type { TodoItem }

import { DurableObject, env } from 'cloudflare:workers'
const todoItemsInit: readonly TodoItem[] = Object.freeze([{ text: 'Buy milk' }, { text: 'Buy strawberries' }])

type TodoItem = { text: string }

async function getTodoItems(): Promise<TodoItem[]> {
  const todoItemsData = await getTodoItemsData()
  const todoItems = await todoItemsData.getTodoItems()
  return todoItems
}

async function addTodoItem(todoItem: TodoItem): Promise<TodoItem[]> {
  const todoItemsData = await getTodoItemsData()
  const todoItems = await todoItemsData.addTodoItem(todoItem)
  return todoItems
}

async function resetTodoItems() {
  const todoItemsData = env.TO_DO_LIST_DURABLE_OBJECTS.getByName('vike-todo-list-demo')
  await todoItemsData.resetTodoItems()
  const todoItems = await todoItemsData.getTodoItems()
  return todoItems
}

async function getTodoItemsData() {
  const todoItemsData = env.TO_DO_LIST_DURABLE_OBJECTS.getByName('vike-todo-list-demo')
  return todoItemsData
}

class TodoListDurableObject extends DurableObject {
  async getTodoItems() {
    let todoItems = (await this.ctx.storage.get('all-todo-items')) as TodoItem[]
    todoItems ??= Array.from(todoItemsInit)
    return todoItems
  }
  async addTodoItem(todoItem: TodoItem) {
    const todoItems = await this.getTodoItems()
    todoItems.push(todoItem)
    await this.ctx.storage.put('all-todo-items', todoItems)
    return todoItems
  }
  async resetTodoItems() {
    await this.ctx.storage.put('all-todo-items', null)
  }
}
