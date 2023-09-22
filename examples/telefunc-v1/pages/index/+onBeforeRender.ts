// https://vike.dev/onBeforeRender
export default onBeforeRender

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
