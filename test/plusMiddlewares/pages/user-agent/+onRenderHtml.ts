export { onRenderHtml }

import { escapeInject } from 'vike/server'
import type { PageContextServer } from 'vike/types'

function onRenderHtml(pageContext: PageContextServer & { userAgent?: string }) {
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <p>userAgent: ${String(pageContext.userAgent)}</p>
      </body>
    </html>`
}
