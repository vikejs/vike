export { onNewTodo }

import { createTodoItem, getTodoItems } from '../../database/todoItems'

async function onNewTodo({ text }: { text: string }) {
  await createTodoItem({ text })
  const todoItems = await getTodoItems()
  return { todoItems }
}
