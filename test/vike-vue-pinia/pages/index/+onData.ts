// Environment: server, client
export { onData }

import type { PageContext } from 'vike/types'
import type { Data } from './+data'
import { useTodoStore } from '../../stores/useTodoStore'

function onData(pageContext: PageContext & { data?: Data }) {
  const { initTodos } = useTodoStore(pageContext.pinia!)
  initTodos(pageContext.data!.todosInit)

  // Saving KBs: we don't need pageContext.data (we use the store instead)
  // - If we don't delete pageContext.data then Vike sends pageContext.data to the client-side
  // - This optimization only works if the page is SSR'd: if the page is pre-rendered then don't do this
  if (!pageContext.isPrerendering) delete pageContext.data
}
