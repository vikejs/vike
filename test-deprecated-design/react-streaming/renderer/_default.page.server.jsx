import React from 'react'
import { renderToStream } from 'react-streaming/server'
import { escapeInject } from 'vike/server'
import { Layout } from './Layout'

export { render }
export { passToClient }

// See https://vike.dev/data-fetching
const passToClient = ['pageProps']

async function render(pageContext) {
  const { Page, pageProps, userAgent } = pageContext
  const stream = await renderToStream(
    <Layout>
      <Page {...pageProps} />
    </Layout>,
    { userAgent },
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="root">${stream}</div>
      </body>
    </html>`
}
