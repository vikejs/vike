import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { html } from 'vite-plugin-ssr'
import { PageWrapper } from './PageWrapper'
import { localeDefault, locales } from '../locales'

export { render }
export { passToClient }
export { _onBeforePrerender }

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

function _onBeforePrerender(globalContext) {
  const prerenderedPageContexts = []
  globalContext._prerenderPageContexts.forEach((pageContext) => {
    prerenderedPageContexts.push({
      ...pageContext,
      locale: localeDefault
    })
    locales
      .filter((locale) => locale !== localeDefault)
      .forEach((locale) => {
        prerenderedPageContexts.push({
          ...pageContext,
          url: `/${locale}${pageContext.url}`,
          locale
        })
      })
  })
  return {
    globalContext: {
      _prerenderPageContexts: prerenderedPageContexts
    }
  }
}
