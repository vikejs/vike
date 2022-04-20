import { renderToPipeableStream } from 'react-dom/server'
import React from 'react'
import { escapeInject, pipeNodeStream } from 'vite-plugin-ssr'
import { PageShell } from './PageShell'
import { getPageTitle } from './getPageTitle'
import type { PageContext } from './types'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'

export { render }
export { passToClient }

const passToClient = ['pageProps', 'documentProps', 'someAsyncProps']

function render(pageContext: PageContextBuiltIn & PageContext) {
  const { Page, pageProps } = pageContext
  const stream = renderToPipeableStream(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>,
  )

  const title = getPageTitle(pageContext)

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${pipeNodeStream(stream.pipe)}</div>
      </body>
    </html>`

  return {
    documentHtml,
    // We can return a `pageContext` promise
    pageContext: (async () => {
      return {
        someAsyncProps: 42,
      }
    })(),
  }
}
