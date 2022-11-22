export { render }
export { passToClient }

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, injectPreloadTags, dangerouslySkipEscape, injectAssetTags } from '../../../vite-plugin-ssr/node'
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

  let injectAssetsEnd = null
  let injectPreloadsBegin = null
  let injectPreloadsEnd = null
  if (preloadStrategy === 'DISABLED') {
    // We inject all asset tags at the end before `</body>`. (Instead of injecting CSS in `<head>`.)
    // Note that we must inject these for our app to work.
    injectAssetsEnd = injectAssetTags((assets) => assets.reverse())
    // We don't inject any preload tags. (Except of preload tags for JavaScript, see below.)
    injectPreloadsBegin = injectPreloadTags((assets) => [])
  }
  if (preloadStrategy === 'ONLY_FONT') {
    injectPreloadsBegin = injectPreloadTags((assets) => assets.filter((a) => a.assetType === 'font'))
  }
  if (preloadStrategy) {
    // We strongly recommend to always inject preload tags for JavaScript.
    // Note that if we don't use `injectPreloadTags()`, then vite-plugin-ssr fallsbacks to automatically injecting preload tags.
    injectPreloadsEnd = injectPreloadTags((assets) => assets.filter((a) => a.assetType === 'script'))
  }

        //${injectAssetsEnd}
  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        ${injectPreloadsBegin}
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
        ${injectPreloadsEnd}
      </body>
    </html>`
}
