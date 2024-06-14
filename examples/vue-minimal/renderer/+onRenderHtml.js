// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { renderToString } from '@vue/server-renderer'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { createVueApp } from './createVueApp'

async function onRenderHtml(pageContext) {
  const app = createVueApp(pageContext)
  const appHtml = await renderToString(app)

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
}
