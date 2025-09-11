export { data }
export type Data = Awaited<ReturnType<typeof data>>

import { getTodoItems } from '../../database/todoItems'

async function data() {
  const todoItemsInitial = await getTodoItems()
  return {
    todoItemsInitial,
  }
}
