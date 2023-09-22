// https://vike.dev/onBeforeRender
export default onBeforeRender

import { renderToNodeStream } from '@vue/server-renderer'
import { createApp } from './app'

async function onBeforeRender(pageContext) {
  const { app, store } = createApp(pageContext)

  const stream = renderToNodeStream(app)

  const initialStoreState = store.state.value

  return {
    pageContext: {
      initialStoreState,
      stream
    }
  }
}
