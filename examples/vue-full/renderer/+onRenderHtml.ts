// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { renderToNodeStream } from '@vue/server-renderer'
import { escapeInject } from 'vike/server'
import { createVueApp } from './createVueApp'
import { getPageTitle } from './getPageTitle'
import type { PageContextServer } from 'vike/types'

const onRenderHtml = async (pageContext: PageContextServer) => {
  const app = createVueApp(pageContext)
  const stream = renderToNodeStream(app)

  const title = getPageTitle(pageContext)

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="app">${stream}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      // https://vike.dev/streaming
      enableEagerStreaming: true,
    },
  }
}
