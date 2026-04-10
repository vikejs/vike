export { onNewTodo }
export { onReset }

import { addTodoItem, resetTodoItems } from '../../database/todoItems'

async function onNewTodo(todoItem: { text: string }) {
  const todoItems = await addTodoItem(todoItem)
  return { todoItems }
}

async function onReset() {
  const todoItems = await resetTodoItems()
  return { todoItems }
}
