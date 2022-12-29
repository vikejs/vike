export { render }
export { passToClient }

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { PageLayout } from './PageLayout'

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps']

async function render(pageContext) {
  const { Page, pageProps, userAgent } = pageContext
  const page = renderToString(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>,
    { userAgent }
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${dangerouslySkipEscape(page)}</div>
      </body>
    </html>`
}
