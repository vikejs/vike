export { isAsset }
export { inferMediaType }
export type { MediaType }

// Copied from Vite: https://github.com/vitejs/vite/blob/9d28ffd3410a3ea2b739cce31e845f59cebd3cc6/packages/vite/src/node/constants.ts#L83-L121
// Altenratively: check sirv's source code (it needs to send the right Content-Type header)

import { styleFileRE, isScriptFile } from '../runtime/utils'

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

const assetFileExtensions = [
  // images
  'png',
  'jpg',
  'jpeg',
  'jfif',
  'pjpeg',
  'pjp',
  'gif',
  'svg',
  'ico',
  'webp',
  'avif',

  // media
  'mp4',
  'webm',
  'ogg',
  'mp3',
  'wav',
  'flac',
  'aac',

  // fonts
  'woff2',
  'woff',
  'eot',
  'ttf',
  'otf',

  // other
  'webmanifest',
  'pdf',
  'txt'
]
function isAsset(file: string) {
  return assetFileExtensions.some((ext) => file.endsWith('.' + ext))
}
