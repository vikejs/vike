// https://vike.dev/onRenderHtml
export default onRenderHtml

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import type { InjectFilterEntry } from 'vite-plugin-ssr/types'
// @ts-ignore
import { PageLayout } from './PageLayout'

async function onRenderHtml(pageContext: any) {
  const { Page, pageProps } = pageContext
  // The config 'preloadStrategy' is a custom config we defined at ./+config.ts
  const { preloadStrategy } = pageContext.config
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
    injectFilter(assets: InjectFilterEntry[]) {
      // Default vite-plugin-ssr's preloading strategy
      if (!preloadStrategy) return

      if (preloadStrategy === 'DISABLED') {
        assets.forEach((asset) => {
          if (
            // Entries always need to be injected
            asset.isEntry ||
            // We don't touch JavaScript preloading (recommended)
            asset.assetType === 'script'
          ) {
            return
          }
          asset.inject = false
        })
      }

      if (preloadStrategy === 'IMAGES') {
        assets.forEach((asset) => {
          if (asset.assetType === 'image') {
            asset.inject = 'HTML_BEGIN'
          }
        })
      }
    }
  }
}
