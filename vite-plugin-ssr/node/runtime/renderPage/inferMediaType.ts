export { inferMediaType }
export type { MediaType }

import { styleFileRE, isScriptFile } from '../utils.js'

type MediaType = null | {
  // List of `as` values: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-as
  assetType: 'image' | 'script' | 'font' | 'style'
  mediaType:
    | 'text/javascript'
    | 'text/css'
    | 'image/jpeg'
    | 'image/png'
    | 'image/webp'
    | 'image/gif'
    | 'image/svg+xml'
    | 'font/ttf'
    | 'font/woff'
    | 'font/woff2'
}

function inferMediaType(href: string): MediaType {
  // Basics
  if (styleFileRE.test(href)) {
    return { mediaType: 'text/css', assetType: 'style' }
  }
  if (isScriptFile(href)) {
    return { mediaType: 'text/javascript', assetType: 'script' }
  }

  // Images
  if (href.endsWith('.png')) {
    return { assetType: 'image', mediaType: 'image/png' }
  }
  if (href.endsWith('.webp')) {
    return { assetType: 'image', mediaType: 'image/webp' }
  }
  if (href.endsWith('.jpg') || href.endsWith('.jpeg')) {
    return { assetType: 'image', mediaType: 'image/jpeg' }
  }
  if (href.endsWith('.gif')) {
    return { assetType: 'image', mediaType: 'image/gif' }
  }
  if (href.endsWith('.svg')) {
    return { assetType: 'image', mediaType: 'image/svg+xml' }
  }

  // Fonts
  if (href.endsWith('.ttf')) {
    return { assetType: 'font', mediaType: 'font/ttf' }
  }
  if (href.endsWith('.woff')) {
    return { assetType: 'font', mediaType: 'font/woff' }
  }
  if (href.endsWith('.woff2')) {
    return { assetType: 'font', mediaType: 'font/woff2' }
  }

  return null
}
