import React from 'react'
import { renderToStream } from 'react-streaming/server'
import { escapeInject, injectPreloadTags } from 'vite-plugin-ssr'
import { PageLayout } from './PageLayout'

export { render }
export { passToClient }

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps']

async function render(pageContext) {
  const { Page, pageProps, userAgent } = pageContext
  const { preloadStrategy } = pageContext.exports
  const stream = await renderToStream(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>,
    { userAgent }
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
        <div id="page-view">${stream}</div>
        ${injectEnd}
      </body>
    </html>`
}
