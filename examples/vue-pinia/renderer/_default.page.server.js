export { render }
export { onBeforeRender }
export { passToClient }

import { renderToNodeStream } from '@vue/server-renderer'
import { escapeInject } from 'vite-plugin-ssr'
import { createApp } from './app'

const passToClient = ['initialStoreState', 'pageProps', 'routeParams']

async function render(pageContext) {
  const { stream } = pageContext
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${stream}</div>
      </body>
    </html>`
}

async function onBeforeRender(pageContext) {
  const { app, store } = createApp(pageContext)

  const stream = renderToNodeStream(app)

  const initialStoreState = store.state.value

  return {
    pageContext: {
      initialStoreState,
      stream,
    },
  }
}
