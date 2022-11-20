export { inferAssetTag }
export { inferPreloadTag }

import { assert } from '../../utils'
import type { PageAsset } from '../../renderPage/getPageAssets'

function inferPreloadTag(pageAsset: PageAsset): string {
  const { src, assetType, mediaType } = pageAsset
  // `crossorigin` is needed for fonts, see https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload#cors-enabled_fetches
  const crossorigin = !(assetType === 'font' || src.startsWith('http://') || src.startsWith('https://')) ? '' : ' crossorigin' // prettier-ignore
  // Vite transpiles all browser-side JavaScript to ESM
  const rel = assetType === 'script' ? 'modulepreload' : 'preload'
  const as = !assetType ? '' : ` as="${assetType}"`
  const type = !mediaType ? '' : ` type="${mediaType}"`
  return `<link rel="${rel}" href="${src}"${as}${type}${crossorigin}>`
}

function inferAssetTag(pageAsset: PageAsset): string {
  const { src, assetType, mediaType } = pageAsset
  if (assetType === 'script') {
    assert(mediaType === 'text/javascript')
    // Vite transpiles all browser-side JavaScript to ESM
    return `<script type="module" src="${src}" async></script>`
  }
  if (assetType === 'style') {
    return `<link rel="stylesheet" type="text/css" href="${src}">`
  }
  assert(false)
}
