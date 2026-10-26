export { inferAssetTag }
export { inferPreloadTag }
export { inferEarlyHintLink }
export { scriptCommonAttrs }

import { assert } from '../../../../../utils/assert.js'
import type { PageAsset } from '../../getPageAssets.js'
import { inferNonceAttr, type PageContextCspNonce } from '../../csp.js'
import '../../../../assertEnvServer.js'

// We can't use `defer` here. With `defer`, the entry script won't start before `</body>` has been parsed, preventing progressive hydration during SSR streaming, see https://github.com/vikejs/vike/pull/1271
const scriptCommonAttrs = 'type="module" async'

function inferPreloadTag(pageAsset: PageAsset): string {
  const { src, assetType, mediaType, integrity } = pageAsset
  const rel = getRel(pageAsset)
  const attributes = [
    `rel="${rel}"`,
    `href="${src}"`,
    !assetType ? null : `as="${assetType}"`,
    !mediaType ? null : `type="${mediaType}"`,
    // `crossorigin` is needed for fonts, see https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload#cors-enabled_fetches
    !isCrossOrigin(pageAsset) ? null : 'crossorigin',
    !integrity ? null : `integrity="${integrity}"`,
  ]
    .filter(Boolean)
    .join(' ')
  return `<link ${attributes}>`
}

function inferAssetTag(pageAsset: PageAsset, pageContext: PageContextCspNonce): string {
  const { src, assetType, mediaType } = pageAsset
  const integrityAttr = inferIntegrityAttr(pageAsset)
  if (assetType === 'script') {
    assert(mediaType === 'text/javascript')
    const nonceAttr = inferNonceAttr(pageContext)
    return `<script src="${src}" ${scriptCommonAttrs}${nonceAttr}${integrityAttr}></script>`
  }
  if (assetType === 'style') {
    // WARNING: if changing following line, then also update https://github.com/vikejs/vike/blob/fae90a15d88e5e87ca9fcbb54cf2dc8773d2f229/vike/client/shared/removeFoucBuster.ts#L29
    return `<link rel="stylesheet" type="text/css" href="${src}"${integrityAttr}>`
  }
  assert(false, { pageAsset })
}

// We ignore crossorigin, it seems like Early Hints doesn't have a "crossorigin" property: https://github.com/vikejs/vike/issues/618#issuecomment-1415752222
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

function isCrossOrigin({ src, assetType, integrity }: PageAsset): boolean {
  return assetType === 'font' || !!integrity || src.startsWith('http://') || src.startsWith('https://')
}

// https://vike.dev/csp#sri
function inferIntegrityAttr({ integrity }: PageAsset): string {
  // `crossorigin` is needed for assets loaded from another origin (e.g. https://vike.dev/base-url#baseassets), otherwise the browser blocks them, see https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity#subresource_integrity_and_cors
  return !integrity ? '' : ` integrity="${integrity}" crossorigin`
}
