// See https://vike.dev/onBeforeRender
export { onBeforeRender }

import { todoItems } from '../../database/todoItems'

function onBeforeRender() {
  const todoItemsInitial = todoItems
  return {
    pageContext: {
      pageProps: {
        todoItemsInitial,
      },
    },
  }
}
