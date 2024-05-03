// https://vike.dev/onRenderHtml
export { onRenderHtml }

import React from 'react'
import { renderToStream } from 'react-streaming/server'
import { escapeInject } from 'vike/server'
import { PageLayout } from './PageLayout'

async function onRenderHtml(pageContext) {
  const { Page, pageProps, headers } = pageContext
  const stream = await renderToStream(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>,
    { userAgent: headers['user-agent'] }
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${stream}</div>
      </body>
    </html>`
}
