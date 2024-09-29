export { inferMediaType }
export type { MediaType }

import { styleFileRE, isScriptFile } from '../utils.js'

type MediaType = null | {
  // List of `as` values: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-as
  assetType:
    | 'image'
    | 'script'
    | 'font'
    | 'style'
    | 'audio'
    | 'video'
    | 'document'
    | 'fetch'
    | 'track'
    | 'worker'
    | 'embed'
    | 'object'
  mediaType:
    | 'text/javascript'
    | 'text/css'
    | 'image/avif'
    | 'image/jpeg'
    | 'image/png'
    | 'image/webp'
    | 'image/gif'
    | 'image/svg+xml'
    | 'font/ttf'
    | 'font/woff'
    | 'font/woff2'
    | 'video/mp4'
    | 'video/webm'
    | 'video/ogg'
    | 'video/mpeg'
    | 'video/x-msvideo'
    | 'video/quicktime'
    | 'audio/mpeg'
    | 'audio/wav'
    | 'audio/ogg'
    | 'audio/aac'
    | 'audio/midi'
    | 'audio/flac'
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
  if (href.endsWith('.avif')) {
    return { assetType: 'image', mediaType: 'image/avif' }
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

  // Videos
  if (href.endsWith('.mp4')) {
    return { assetType: 'video', mediaType: 'video/mp4' }
  }
  if (href.endsWith('.webm')) {
    return { assetType: 'video', mediaType: 'video/webm' }
  }
  if (href.endsWith('.ogv')) {
    return { assetType: 'video', mediaType: 'video/ogg' }
  }
  if (href.endsWith('.mpeg') || href.endsWith('.mpg')) {
    return { assetType: 'video', mediaType: 'video/mpeg' }
  }
  if (href.endsWith('.avi')) {
    return { assetType: 'video', mediaType: 'video/x-msvideo' }
  }
  if (href.endsWith('.mov') || href.endsWith('.qt')) {
    return { assetType: 'video', mediaType: 'video/quicktime' }
  }

  // Audios
  if (href.endsWith('.mp3')) {
    return { assetType: 'audio', mediaType: 'audio/mpeg' }
  }
  if (href.endsWith('.wav')) {
    return { assetType: 'audio', mediaType: 'audio/wav' }
  }
  if (href.endsWith('.ogg')) {
    return { assetType: 'audio', mediaType: 'audio/ogg' }
  }
  if (href.endsWith('.m4a')) {
    return { assetType: 'audio', mediaType: 'audio/aac' }
  }
  if (href.endsWith('midi') || href.endsWith('.mid')) {
    return { assetType: 'audio', mediaType: 'audio/midi' }
  }
  if (href.endsWith('.flac')) {
    return { assetType: 'audio', mediaType: 'audio/flac' }
  }

  return null
}
