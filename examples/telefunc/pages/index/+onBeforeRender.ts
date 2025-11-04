// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { PageContextServer } from 'vike/types'
import { todoItems } from '../../database/todoItems'

const onBeforeRender = async (pageContext: PageContextServer) => {
  const todoItemsInitial = todoItems
  return {
    pageContext: {
      pageProps: {
        todoItemsInitial,
      },
    },
  }
}
