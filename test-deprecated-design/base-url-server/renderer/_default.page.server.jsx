import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { Layout } from './Layout'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
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
    <Layout>
      <Page {...pageProps} />
    </Layout>,
  )

  // The assets base URL is automatically injected to `logoUrl`.
  // We can also manually reference and inject the assets base URL:
  const manifestUrl = import.meta.env.BASE_ASSETS + 'manifest.json'

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
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
