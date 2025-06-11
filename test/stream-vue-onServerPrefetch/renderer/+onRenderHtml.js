// https://vike.dev/onRenderHtml
export default onRenderHtml

import { escapeInject } from 'vike/server'

async function onRenderHtml(pageContext) {
  const { stream } = pageContext

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${stream}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true,
    },
  }
}
