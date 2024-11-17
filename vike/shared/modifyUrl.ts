export { modifyUrl }

import { createUrlFromComponents, parseUrl } from './utils'

/**
 * Modify a URL.
 *
 * Example: changing the URL pathname for internationalization.
 *
 * https://vike.dev/modifyUrl
 */
function modifyUrl(
  url: string,
  modify: {
    pathname?: string
    hostname?: string
    port?: number
    protocol?: string
  }
): string {
  const urlParsed = parseUrl(url, '/')

  // Pathname
  const pathname = modify.pathname ?? urlParsed.pathname

  // Origin
  const originParts: string[] = [
    modify.protocol ?? urlParsed.protocol ?? '',
    modify.hostname ?? urlParsed.hostname ?? ''
  ]
  const port = modify.port ?? urlParsed.port
  if (port || port === 0) {
    originParts.push(`:${port}`)
  }
  const origin = originParts.join('')

  const urlModified = createUrlFromComponents(
    origin,
    pathname,
    // Should we also support modifying search and hash?
    urlParsed.searchOriginal,
    urlParsed.hashOriginal
  )
  return urlModified
}
