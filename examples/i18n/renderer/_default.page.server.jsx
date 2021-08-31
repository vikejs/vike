import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { html } from 'vite-plugin-ssr'
import { PageWrapper } from './PageWrapper'

export { render }
export { passToClient }

const passToClient = ['pageProps', 'locale']

function render(pageContext) {
  const { Page, pageProps } = pageContext
  const pageHtml = ReactDOMServer.renderToString(
    <PageWrapper pageContext={pageContext}>
      <Page {...pageProps} />
    </PageWrapper>
  )

  return html`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${html.dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
