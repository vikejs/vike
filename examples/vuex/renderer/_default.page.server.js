import { renderToString } from '@vue/server-renderer'
import { escapeInjections, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { createApp } from './app'

export { render }
export { addPageContext }
export { passToClient }

const passToClient = ['INITIAL_STATE']

async function render(pageContext) {
  const { appHtml } = pageContext
  return escapeInjections`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
}

async function addPageContext(pageContext) {
  const { Page } = pageContext
  const { app, store } = createApp({ Page })

  const appHtml = await renderToString(app)

  const INITIAL_STATE = store.state

  return {
    INITIAL_STATE,
    appHtml
  }
}
