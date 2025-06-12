export { render }
export { passToClient }

import ReactDOMServer from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { Layout } from './Layout'

// See https://vike.dev/data-fetching
const passToClient = ['pageProps']

function render(pageContext) {
  let pageHtml
  if (!pageContext.Page) {
    // SPA
    pageHtml = ''
  } else {
    // SSR / HTML-only
    const { Page, pageProps } = pageContext
    pageHtml = ReactDOMServer.renderToString(
      <Layout>
        <Page {...pageProps} />
      </Layout>,
    )
  }

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="react-container">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
