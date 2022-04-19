export { inferAssetTag }

import { assert } from '../../utils'
import type { PageAsset } from '../injectAssets'

function inferAssetTag(pageAsset: PageAsset): string {
  const { src, assetType, mediaType, preloadType } = pageAsset
  if (assetType === 'script') {
    assert(mediaType === 'text/javascript')
    return `<script type="module" src="${src}" async></script>`
  }
  if (assetType === 'style') {
    // CSS has highest priority.
    // Would there be any advantage of using a preload tag for a css file instead of loading it right away?
    return `<link rel="stylesheet" type="text/css" href="${src}">`
  }
  if (assetType === 'preload') {
    if (preloadType === 'font') {
      // `crossorigin` is needed for fonts, see https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload#cors-enabled_fetches
      return `<link rel="preload" as="font" crossorigin type="${mediaType}" href="${src}">`
    }
    if (preloadType === 'script') {
      assert(mediaType === 'text/javascript')
      return `<link rel="modulepreload" as="script" type="${mediaType}" href="${src}">`
    }
    const attributeAs = !preloadType ? '' : ` as="${preloadType}"`
    const attributeType = !mediaType ? '' : ` type="${mediaType}"`
    return `<link rel="preload" href="${src}"${attributeAs}${attributeType}>`
  }
  assert(false)
}
