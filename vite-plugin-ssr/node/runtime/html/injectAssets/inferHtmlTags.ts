export { inferAssetTag }
export { inferPreloadTag }
export { inferEarlyHintLink }

import { assert } from '../../../utils'
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

function inferAssetTag(pageAsset: PageAsset): string {
  const { src, assetType, mediaType } = pageAsset
  if (assetType === 'script') {
    assert(mediaType === 'text/javascript')
    // Using <script async> seems problematic:
    //  - in dev: https://github.com/brillout/vite-plugin-ssr/issues/524
    //  - in prod: https://github.com/brillout/vite-plugin-ssr/issues/567
    return `<script type="module" src="${src}" defer></script>`
  }
  if (assetType === 'style') {
    return `<link rel="stylesheet" type="text/css" href="${src}">`
  }
  assert(false, { pageAsset })
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
