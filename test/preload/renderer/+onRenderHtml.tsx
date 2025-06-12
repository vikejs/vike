export default onRenderHtml

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from '../../../packages/vike/node/runtime'
import type { InjectFilterEntry } from '../../../packages/vike/types'
// @ts-ignore
import { Layout } from './Layout'

async function onRenderHtml(pageContext: any) {
  const { Page, pageProps } = pageContext
  const { preloadStrategy } = pageContext.exports
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

      if (preloadStrategy === 'EAGER') {
        assets.forEach((asset) => {
          asset.inject = 'HTML_BEGIN'
        })
      }

      if (preloadStrategy === 'DISABLED') {
        assets.forEach((asset) => {
          // Entries always need to be injected
          if (asset.isEntry) return
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
