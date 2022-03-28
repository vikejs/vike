import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { PageShell } from './PageShell'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
// Assets deployed to a CDN:
//  - logo.svg
//  - manifest.json
import logoUrl from './logo.svg'

export { render }
export { passToClient }

const passToClient = ['pageProps']

function render(pageContext) {
  const { Page, pageProps } = pageContext
  const pageHtml = ReactDOMServer.renderToString(
    <PageShell>
      <Page {...pageProps} />
    </PageShell>,
  )

  // Vite automatically injects the Base URL to `logoUrl`.
  // We can also manually inject the Base URL:
  const manifestUrl = import.meta.env.BASE_URL + 'manifest.json'

  return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <link rel="manifest" href="${manifestUrl}">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite App</title>
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
