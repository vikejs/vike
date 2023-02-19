export { render }
export { passToClient }
export { onBeforePrerender }

import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { PageShell } from './PageShell'
import { locales } from '../locales'

const passToClient = ['pageProps', 'locale']

function render(pageContext) {
  const { Page, pageProps } = pageContext
  const pageHtml = ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}

// We only need this for pre-rendered apps https://vite-plugin-ssr.com/pre-rendering
function onBeforePrerender(prerenderContext) {
  const pageContexts = []
  prerenderContext.pageContexts.forEach((pageContext) => {
    // Duplicate pageContext for each locale
    locales.forEach((locale) => {
      // Localize URL and pageContext
      pageContexts.push({
        ...pageContext,
        urlOriginal: `/${locale}${pageContext.urlOriginal}`,
        locale
      })
    })
  })
  return {
    prerenderContext: {
      pageContexts
    }
  }
}
