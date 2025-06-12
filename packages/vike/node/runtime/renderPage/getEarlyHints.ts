export { getEarlyHints }
export type { EarlyHint }

import { isFontFallback } from './isFontFallback.js'
import { inferEarlyHintLink } from '../html/injectAssets/inferHtmlTags.js'
import type { PageAsset } from './getPageAssets.js'

type EarlyHint = PageAsset & {
  earlyHintLink: string
}

function getEarlyHints(assets: PageAsset[]): EarlyHint[] {
  const earlyHints: EarlyHint[] = []
  {
    assets.forEach((asset) => {
      // Don't early hint fallback fonts, https://github.com/vikejs/vike/issues/624
      if (isFontFallback(asset, earlyHints)) return
      earlyHints.push({
        ...asset,
        earlyHintLink: inferEarlyHintLink(asset),
      })
    })
  }
  return earlyHints
}
