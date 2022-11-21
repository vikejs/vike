export { render }
export { passToClient }

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, injectPreloadTags, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { PageLayout } from './PageLayout'

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps']

async function render(pageContext) {
  const { Page, pageProps } = pageContext
  const { preloadStrategy } = pageContext.exports
  const pageHtml = renderToString(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  )

  const injectBegin = !preloadStrategy
    ? ''
    : injectPreloadTags((assets) => {
        if (preloadStrategy === 'DISABLED') {
          return []
        }
        if (preloadStrategy === 'ONLY_FONT') {
          return assets.filter((a) => a.assetType === 'font')
        }
      })
  const injectEnd = !preloadStrategy
    ? ''
    : injectPreloadTags((assets) => assets.filter((a) => a.assetType === 'script'))

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        ${injectBegin}
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
        ${injectEnd}
      </body>
    </html>`
}
