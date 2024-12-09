// We use Telefunc (https://telefunc.com) for data mutations. Being able to use Telefunc for fetching initial data is work-in-progress (https://vike.dev/data-fetching#tools).

import { todos } from '../../database/todoItems'

export async function onNewTodo({ text }: { text: string }) {
  todos.push({ text })
}
