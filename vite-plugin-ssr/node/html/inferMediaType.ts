import { assert } from '../../shared/utils'

export { inferMediaType }
export { MediaType }

type MediaType = null | {
  preloadType: 'image' | 'script' | 'font' | 'style'
  mediaType:
    | 'text/javascript'
    | 'text/css'
    | 'image/jpeg'
    | 'image/png'
    | 'image/gif'
    | 'image/svg+xml'
    | 'font/ttf'
    | 'font/woff'
    | 'font/woff2'
}
function inferMediaType(href: string): MediaType {
  assert(href.startsWith('/'))
  assert(!href.startsWith('//'))

  // Basics
  if (href.endsWith('.css')) {
    return { mediaType: 'text/css', preloadType: 'style' }
  }
  if (href.endsWith('.js')) {
    return { mediaType: 'text/javascript', preloadType: 'script' }
  }

  // Images
  if (href.endsWith('.png')) {
    return { preloadType: 'image', mediaType: 'image/png' }
  }
  if (href.endsWith('.jpg') || href.endsWith('.jpeg')) {
    return { preloadType: 'image', mediaType: 'image/jpeg' }
  }
  if (href.endsWith('.gif')) {
    return { preloadType: 'image', mediaType: 'image/gif' }
  }
  if (href.endsWith('.svg')) {
    return { preloadType: 'image', mediaType: 'image/svg+xml' }
  }

  // Fonts
  if (href.endsWith('.ttf')) {
    return { preloadType: 'font', mediaType: 'font/ttf' }
  }
  if (href.endsWith('.woff')) {
    return { preloadType: 'font', mediaType: 'font/woff' }
  }
  if (href.endsWith('.woff2')) {
    return { preloadType: 'font', mediaType: 'font/woff2' }
  }

  return null
}
