// Environment: server
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import { fetchCountInit } from '../../components/Counter/fetchCountInit'
import type { PageContextServer } from 'vike/types'

async function data(pageContext: PageContextServer) {
  const [countInitial, todoItemsInitial] = await Promise.all([fetchCountInit(), fetchTodosInit()])
  return { countInitial, todoItemsInitial }
}

// Pretending the list is fetched over the network
async function fetchTodosInit() {
  return [
    //
    { text: 'Buy apples' },
    { text: `Update Node.js ${process.version} to latest version` },
  ]
}
