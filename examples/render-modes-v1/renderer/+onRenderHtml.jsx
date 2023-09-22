// https://vike.dev/onRenderHtml
export default onRenderHtml

import ReactDOMServer from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { PageLayout } from './PageLayout'

function onRenderHtml(pageContext) {
  let pageHtml
  if (!pageContext.Page) {
    // SPA
    pageHtml = ''
  } else {
    // SSR / HTML-only
    const { Page, pageProps } = pageContext
    pageHtml = ReactDOMServer.renderToString(
      <PageLayout>
        <Page {...pageProps} />
      </PageLayout>
    )
  }

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="react-container">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
