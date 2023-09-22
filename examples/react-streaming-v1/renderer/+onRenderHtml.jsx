// https://vike.dev/onRenderHtml
export default onRenderHtml

import React from 'react'
import { renderToStream } from 'react-streaming/server'
import { escapeInject } from 'vite-plugin-ssr/server'
import { PageLayout } from './PageLayout'

async function onRenderHtml(pageContext) {
  const { Page, pageProps, userAgent } = pageContext
  const stream = await renderToStream(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>,
    { userAgent }
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${stream}</div>
      </body>
    </html>`
}
