export { inferAssetTag }
export { inferPreloadTag }
export { inferEarlyHintLink }

import { assert } from '../../utils.js'
import type { PageAsset } from '../../renderPage/getPageAssets.js'

function inferPreloadTag(pageAsset: PageAsset): string {
  const { src, assetType, mediaType } = pageAsset
  const rel = getRel(pageAsset)
  const attributes = [
    `rel="${rel}"`,
    `href="${src}"`,
    !assetType ? null : `as="${assetType}"`,
    !mediaType ? null : `type="${mediaType}"`,
    // `crossorigin` is needed for fonts, see https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload#cors-enabled_fetches
    !isCrossOrigin(pageAsset) ? null : 'crossorigin'
  ]
    .filter(Boolean)
    .join(' ')
  return `<link ${attributes}>`
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

// We ignore crossorigin, it seems like Early Hints doesn't have a "crossorigin" property: https://github.com/brillout/vite-plugin-ssr/issues/618#issuecomment-1415752222
function inferEarlyHintLink(pageAsset: PageAsset): string {
  const { src, assetType } = pageAsset
  const rel = getRel(pageAsset)
  return [`<${src}>`, `rel=${rel}`, !assetType ? null : `as=${assetType}`].filter(Boolean).join('; ')
}

function getRel({ assetType }: PageAsset): string {
  if (assetType === 'script') {
    // Vite transpiles all browser-side JavaScript to ESM
    return 'modulepreload'
  }
  return 'preload'
}

function isCrossOrigin({ src, assetType }: PageAsset): boolean {
  return assetType === 'font' || src.startsWith('http://') || src.startsWith('https://')
}
