// https://vike.dev/data
import { todos } from '../../database/todoItems'
import type { PageContextServer } from 'vike/types'

export type Data = {
  todo: { text: string }[]
}

export default async function data(_pageContext: PageContextServer): Promise<Data> {
  return { todo: todos }
}
