// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { OnBeforeRenderAsync } from 'vike/types'
import { getTodoItems } from '../../database/todoItems'

const onBeforeRender: OnBeforeRenderAsync = async (pageContext): ReturnType<OnBeforeRenderAsync> => {
  const todoItemsInitial = await getTodoItems()
  return {
    pageContext: {
      pageProps: {
        todoItemsInitial
      }
    }
  }
}
