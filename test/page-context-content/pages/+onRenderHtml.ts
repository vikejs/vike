export { onRenderHtml }

import { escapeInject } from 'vike/server'
import type { PageContextServer } from 'vike/types'

function onRenderHtml(pageContext: PageContextServer) {
  const Page = pageContext.Page as () => string
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <h1>${Page()}</h1>
      </body>
    </html>`
}
