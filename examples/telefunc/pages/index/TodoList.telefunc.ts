export { onNewTodo }

import { todoItems } from '../../database/todoItems'

async function onNewTodo({ text }: { text: string }) {
  todoItems.push({ text })
  return { todoItems }
}
