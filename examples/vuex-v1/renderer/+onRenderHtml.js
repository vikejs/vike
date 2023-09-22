// https://vike.dev/onRenderHtml
export default onRenderHtml

import { escapeInject, dangerouslySkipEscape } from 'vike/server'

async function onRenderHtml(pageContext) {
  const { appHtml } = pageContext
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
}
