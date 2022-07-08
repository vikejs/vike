import React from 'react'
import { renderToStream } from 'react-streaming/server'
import { escapeInject } from 'vite-plugin-ssr'
import { PageLayout } from './PageLayout'

export { render }
export { passToClient }

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps']

async function render(pageContext: any) {
  const { Page, pageProps } = pageContext
  const stream = await renderToStream(
    <PageLayout pageContext={pageContext}>
      <Page {...pageProps} />
    </PageLayout>,
    { userAgent: pageContext.userAgent },
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${stream}</div>
      </body>
    </html>`
}
