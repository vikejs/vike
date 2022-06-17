export { render }
export { passToClient }

import { renderToString } from '@vue/server-renderer'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { createApp } from './app'

const passToClient = ['pageProps', 'routeParams']

async function render(pageContext) {
  const app = createApp(pageContext)
  const appHtml = await renderToString(app)
  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
}
