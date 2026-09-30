export { onRenderHtml }

import { dangerouslySkipEscape, escapeInject } from 'vike/server'
import type { PageContextServer } from 'vike/types'
import type { Page } from './types'

function onRenderHtml(pageContext: PageContextServer) {
  const { html } = pageContext.Page as Page
  // Both kinds of HTML: a string and a stream
  const pageHtml = pageContext.urlPathname === '/prerendered' ? dangerouslySkipEscape(html) : getStream(html)
  return escapeInject`<!DOCTYPE html>
<html>
  <head>
    <title>Streamed pageContext values</title>
  </head>
  <body>
    <div id="root">${pageHtml}</div>
  </body>
</html>`
}

function getStream(html: string) {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(html))
      controller.close()
    },
  })
}
