// https://vike.dev/onRenderHtml
export { onRenderHtml }

import React from 'react'
import { renderToStream } from 'react-streaming/server'
import { escapeInject } from 'vike/server'
import { Layout } from './Layout'

async function onRenderHtml(pageContext) {
  const { Page, pageProps, headers } = pageContext
  const stream = await renderToStream(
    <Layout>
      <Page {...pageProps} />
    </Layout>,
    { userAgent: headers['user-agent'] },
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="root">${stream}</div>
      </body>
    </html>`
}
