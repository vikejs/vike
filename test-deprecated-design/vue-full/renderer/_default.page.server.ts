import { renderToNodeStream } from '@vue/server-renderer'
import { escapeInject } from 'vike/server'
import { createVueApp } from './createVueApp'
import { getPageTitle } from './getPageTitle'
import type { PageContext } from './types'
import type { PageContextBuiltInServer } from 'vike/types'

export { passToClient }
export { render }

const passToClient = ['pageProps', 'documentProps']

async function render(pageContext: PageContextBuiltInServer & PageContext) {
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
      enableEagerStreaming: true,
    },
  }
}
