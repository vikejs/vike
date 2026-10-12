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
    isAuth?: boolean
    locale?: string
  },
) {
  const { runtime, adapter, params, req, res, isAuth, locale } = pageContext
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <pre>${JSON.stringify({ runtime, adapter, params })}</pre>
        <p>req: ${String(req?.constructor.name)}, res: ${String(res?.constructor.name)}</p>
        <p>isAuth: ${String(isAuth)}, locale: ${String(locale)}</p>
      </body>
    </html>`
}
