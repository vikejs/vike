// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { OnBeforeRenderAsync } from 'vike/types'
import { todoItems } from '../../database/todoItems'

const onBeforeRender: OnBeforeRenderAsync = async (pageContext): ReturnType<OnBeforeRenderAsync> => {
  const todoItemsInitial = todoItems
  return {
    pageContext: {
      pageProps: {
        todoItemsInitial
      }
    }
  }
}
