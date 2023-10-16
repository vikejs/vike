// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { renderToNodeStream } from '@vue/server-renderer'
import { escapeInject } from 'vike/server'
import { createApp } from './app'
import { getPageTitle } from './getPageTitle'
import type { OnRenderHtmlAsync } from 'vike/types'

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const app = createApp(pageContext)
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
      // https://vike.dev/stream
      enableEagerStreaming: true
    }
  }
}
