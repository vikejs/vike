// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { PageContextServer } from 'vike/types'
import { todoItems } from '../../database/todoItems'

const onBeforeRender = async (pageContext: PageContextServer) => {
  const todoItemsInitial = todoItems
  // @ts-ignore
  pageContext.routeParams.url = new URL('https://vike.dev/bla')
  return {
    pageContext: {
      pageProps: {
        todoItemsInitial,
      },
    },
  }
}
