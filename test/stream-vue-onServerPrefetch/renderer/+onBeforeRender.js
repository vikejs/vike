// https://vike.dev/onBeforeRender
export default onBeforeRender

import { renderToNodeStream } from '@vue/server-renderer'
import { createVueApp } from './createVueApp'

async function onBeforeRender(pageContext) {
  const { app, store } = createVueApp(pageContext)

  const stream = renderToNodeStream(app)

  const initialStoreState = store.state.value

  return {
    pageContext: {
      initialStoreState,
      stream,
    },
  }
}
