export { inferAssetTag }
export { inferPreloadTag }
export { inferEarlyHintLink }
export { inferScriptExecTime }

import { assert } from '../../utils'
import type { PageAsset } from '../../renderPage/getPageAssets'

function inferPreloadTag(pageAsset: PageAsset): string {
  const { src, assetType, mediaType } = pageAsset
  // `crossorigin` is needed for fonts, see https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload#cors-enabled_fetches
  const crossorigin = isCrossOrigin(pageAsset) ? ' crossorigin' : ''
  // Vite transpiles all browser-side JavaScript to ESM
  const rel = getRel(pageAsset)
  const as = !assetType ? '' : ` as="${assetType}"`
  const type = !mediaType ? '' : ` type="${mediaType}"`
  return `<link rel="${rel}" href="${src}"${as}${type}${crossorigin}>`
}

function inferAssetTag(pageAsset: PageAsset, pageContext: { _isProduction: boolean }): string {
  const { src, assetType, mediaType } = pageAsset
  if (assetType === 'script') {
    assert(mediaType === 'text/javascript')
    // Vite transpiles all browser-side JavaScript to ESM
    return `<script type="module" src="${src}" ${inferScriptExecTime(pageContext)}></script>`
  }
  if (assetType === 'style') {
    return `<link rel="stylesheet" type="text/css" href="${src}">`
  }
  assert(false)
}

// - In dev, <script> is before <script <script id="vite-plugin-ssr_pageContext" type="application/json">
// - We therefore need to use `defer` instead of `async`
// - Firefox fails when using `async` instead of `defer`, https://github.com/brillout/vite-plugin-ssr/issues/524
function inferScriptExecTime(pageContext: { _isProduction: boolean }): 'async' | 'defer' {
  const exec = pageContext._isProduction ? 'async' : 'defer'
  return exec
}

function inferEarlyHintLink(pageAsset: PageAsset): string {
  const { src, assetType } = pageAsset
  const rel = getRel(pageAsset)
  const as = !assetType ? '' : `; as=${assetType}`
  const crossorigin = isCrossOrigin(pageAsset) ? '; crossorigin' : ''
  return `<${src}>; rel=${rel}${as}${crossorigin}`
}

function getRel({ assetType }: PageAsset): string {
  const rel = assetType === 'script' ? 'modulepreload' : 'preload'
  return rel
}

function isCrossOrigin({ src, assetType }: PageAsset): boolean {
  return assetType === 'font' || src.startsWith('http://') || src.startsWith('https://')
}
