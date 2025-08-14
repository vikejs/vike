// Environment: server
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import type { PageContextServer } from 'vike/types'

async function data(pageContext: PageContextServer) {
  const todoItemsInitial = await fetchTodosInit()
  return { todoItemsInitial }
}

// Pretending the list is fetched over the network
async function fetchTodosInit() {
  return [
    //
    { text: 'Buy apples' },
    { text: `Update Node.js ${process.version} to latest version` },
  ]
}
