export { onRenderHtml }

import { escapeInject } from 'vike/server'
import type { PageContextServer } from 'vike/types'

function onRenderHtml(pageContext: PageContextServer & { isAuth?: boolean; locale?: string }) {
  const { isAuth, locale } = pageContext
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <p>isAuth: ${String(isAuth)}, locale: ${String(locale)}</p>
      </body>
    </html>`
}
