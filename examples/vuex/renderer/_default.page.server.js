import { renderToString } from '@vue/server-renderer'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { createApp } from './app'

export { render }
export { onBeforeRender }
export { passToClient }

const passToClient = ['INITIAL_STATE']

async function render(pageContext) {
  const { appHtml } = pageContext
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
}

async function onBeforeRender(pageContext) {
  const { Page } = pageContext
  const { app, store } = createApp({ Page })

  const appHtml = await renderToString(app)

  const INITIAL_STATE = store.state

  return {
    pageContext: {
      INITIAL_STATE,
      appHtml,
    },
  }
}
