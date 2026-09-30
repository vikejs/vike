export { onRenderHtml }

import { escapeInject } from 'vike/server'
import type { PageContextServer } from 'vike/types'

function onRenderHtml(pageContext: PageContextServer) {
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <h1>${String(pageContext.content)}</h1>
      </body>
    </html>`
}
