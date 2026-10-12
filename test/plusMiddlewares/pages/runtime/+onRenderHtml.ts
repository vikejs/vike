export { onRenderHtml }

import { escapeInject } from 'vike/server'
import type { PageContextServer } from 'vike/types'

function onRenderHtml(pageContext: PageContextServer & { runtime?: unknown; adapter?: unknown; params?: unknown }) {
  const { runtime, adapter, params } = pageContext
  return escapeInject`<!DOCTYPE html>
    <html>
      <body><pre>${JSON.stringify({ runtime, adapter, params })}</pre></body>
    </html>`
}
