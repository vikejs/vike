export { onRenderHtml }

import { escapeInject } from 'vike/server'
import type { PageContextServer } from 'vike/types'

// Returns HTML: `pageContext.content` isn't the content, even though it's updated here
function onRenderHtml(pageContext: PageContextServer) {
  pageContext.content = `${String(pageContext.content)} and onRenderHtml()`
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <h1>${String(pageContext.content)}</h1>
      </body>
    </html>`
}
