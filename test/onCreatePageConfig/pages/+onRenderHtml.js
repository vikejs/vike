export { onRenderHtml }

import { escapeInject, dangerouslySkipEscape } from 'vike/server'

function onRenderHtml(pageContext) {
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="root">${dangerouslySkipEscape(pageContext.Page())}</div>
      </body>
    </html>`
}
