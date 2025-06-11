// https://vike.dev/onRenderHtml
export { onRenderHtml }

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import type { InjectFilterEntry, OnRenderHtmlAsync } from 'vike/types'
// @ts-ignore
import { Layout } from './Layout'

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const { Page, pageProps } = pageContext
  // The config 'preloadStrategy' is a custom config we defined at ./+config.ts
  const { preloadStrategy } = pageContext.config
  const pageHtml = renderToString(
    <Layout>
      <Page {...pageProps} />
    </Layout>,
  )

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

  return {
    documentHtml,
    injectFilter(assets: InjectFilterEntry[]) {
      // Default Vike's preloading strategy
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
    },
  }
}
