export { render }
export { passToClient }

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape, type InjectFilterEntry } from '../../../vite-plugin-ssr/node'
// @ts-ignore
import { PageLayout } from './PageLayout'

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps']

async function render(pageContext: any) {
  const { Page, pageProps } = pageContext
  const { preloadStrategy } = pageContext.exports
  const pageHtml = renderToString(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  )

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

  return {
    documentHtml,
    injectFilter(assets: InjectFilterEntry[]): InjectFilterEntry[] {
      return assets.map((asset) => {
        if (preloadStrategy === 'EAGER') {
          return {
            ...asset,
            inject: 'HTML_BEGIN'
          }
        }

        if (asset.isEntry) {
          return asset
        }

        let dontInject = false
        if (preloadStrategy === 'DISABLED') {
          dontInject = true
        }
        if (
          preloadStrategy === 'ONLY_FONT' &&
          asset.assetType !== 'font' &&
          asset.assetType !== 'script'
        ) {
          dontInject = true
        }
        if (dontInject) {
          return {
            ...asset,
            inject: false
          }
        }

        // Default vite-plugin-ssr's preloading behavior
        return asset
      })
    }
  }
}
