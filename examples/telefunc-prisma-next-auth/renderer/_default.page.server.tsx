import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject } from 'vite-plugin-ssr'
import { PageShell } from './PageShell'
import { getPageTitle } from './getPageTitle'
import type { PageContext } from './types'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import { Session } from 'next-auth'

export { render }
export { passToClient }

const passToClient = ['pageProps', 'documentProps', 'session']

function render(pageContext: PageContextBuiltIn & PageContext & { session: Session | null }) {
  const { Page, pageProps } = pageContext
  const stream = ReactDOMServer.renderToNodeStream(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>,
  )

  const title = getPageTitle(pageContext)

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${stream}</div>
      </body>
    </html>`
}
