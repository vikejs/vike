// See https://vite-plugin-ssr.com/onBeforeRender
export { onBeforeRender }

import { todoItems } from '../../database/todoItems'

function onBeforeRender() {
  const todoItemsInitial = todoItems
  return {
    pageContext: {
      pageProps: {
        todoItemsInitial
      }
    }
  }
}
