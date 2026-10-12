export { onRenderHtml }

import { escapeInject } from 'vike/server'
import type { PageContextServer } from 'vike/types'

function onRenderHtml(pageContext: PageContextServer & { params?: unknown; runtime?: unknown }) {
  const { params, runtime } = pageContext
  return escapeInject`<!DOCTYPE html>
    <html>
      <body><pre>${JSON.stringify({ params, runtime })}</pre></body>
    </html>`
}
