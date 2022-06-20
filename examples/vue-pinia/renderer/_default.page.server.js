import { renderToNodeStream } from '@vue/server-renderer'
import { escapeInject } from 'vite-plugin-ssr'
import { createApp } from './app'

export { render }
export { onBeforeRender }
export { passToClient }

const passToClient = ['INITIAL_STATE', 'pageProps']

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
  const { Page, routeParams } = pageContext
  const { app, store } = createApp({ Page, routeParams })

  const { pageContext: addendum } = await pageContext.runOnBeforeRenderPageHook(pageContext)

  const stream = renderToNodeStream(app)

  const INITIAL_STATE = store.state.value

  return {
    pageContext: {
      INITIAL_STATE,
      ...addendum,
      stream,
    },
  }
}
