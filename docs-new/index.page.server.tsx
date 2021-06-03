import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { html } from 'vite-plugin-ssr'

export { render }
export { passToClient }

const passToClient = ['pageProps']

function render(pageContext: any) {
  const { Page, pageProps } = pageContext
  const pageContent = ReactDOMServer.renderToString(<Page {...pageProps} />)

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>Vite SSR Plugin</title>
        <meta name="description" content="Add SSR to your Vite app." />
      </head>
      <body>
        <div id="page-view">${html.dangerouslySkipEscape(pageContent)}</div>
      </body>
    </html>`
}
