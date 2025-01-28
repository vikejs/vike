// See https://vike.dev/render-hook
export { render }
// See https://vike.dev/data-fetching
export { passToClient }

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { Layout } from './Layout'

const passToClient = ['pageProps']

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  const page = (
    <Layout>
      <Page {...pageProps} />
    </Layout>
  )
  const pageHtml = renderToString(page)

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
