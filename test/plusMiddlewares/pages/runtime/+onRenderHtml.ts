export { onRenderHtml }

import { escapeInject } from 'vike/server'
import type { PageContextServer } from 'vike/types'

function onRenderHtml(
  pageContext: PageContextServer & {
    runtime?: unknown
    adapter?: unknown
    params?: unknown
    req?: object
    res?: object
  },
) {
  const { runtime, adapter, params, req, res } = pageContext
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <pre>${JSON.stringify({ runtime, adapter, params })}</pre>
        <p>req: ${String(req?.constructor.name)}, res: ${String(res?.constructor.name)}</p>
      </body>
    </html>`
}
