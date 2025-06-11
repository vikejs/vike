export { render }
export { passToClient }
export { onBeforePrerender }

import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { Layout } from './Layout'
import { locales, localeDefault } from '../locales'

const passToClient = ['pageProps', 'locale']

function render(pageContext) {
  const { Page, pageProps } = pageContext
  const pageHtml = ReactDOMServer.renderToString(
    <Layout pageContext={pageContext}>
      <Page {...pageProps} />
    </Layout>,
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}

// We only need this for pre-rendered apps https://vike.dev/pre-rendering
function onBeforePrerender(prerenderContext) {
  const pageContexts = []
  prerenderContext.pageContexts.forEach((pageContext) => {
    // Duplicate pageContext for each locale
    locales.forEach((locale) => {
      // Localize URL
      let { urlOriginal } = pageContext
      if (locale !== localeDefault) {
        urlOriginal = `/${locale}${pageContext.urlOriginal}`
      }
      pageContexts.push({
        ...pageContext,
        urlOriginal,
        // Set pageContext.locale
        locale,
      })
    })
  })
  return {
    prerenderContext: {
      pageContexts,
    },
  }
}
