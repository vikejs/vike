import { renderToStream } from 'react-streaming/server'
import React from 'react'
import { escapeInject } from 'vite-plugin-ssr'
import { PageShell } from './PageShell'
import { getPageTitle } from './getPageTitle'
import type { PageContext } from './types'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'

export { render }
export { passToClient }

const passToClient = ['pageProps', 'documentProps', 'someAsyncProps']

async function render(pageContext: PageContextBuiltIn & PageContext & { userAgent: string }) {
  const { Page, pageProps } = pageContext
  const stream = await renderToStream(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>,
    { userAgent: pageContext.userAgent }
  )

  const title = getPageTitle(pageContext)

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${stream}</div>
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
