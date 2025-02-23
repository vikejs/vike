export { modifyUrl }

import { modifyUrlSameOrigin, type ModifyUrlSameOriginOptions } from './modifyUrlSameOrigin.js'
import { createUrlFromComponents, parseUrl } from './utils.js'

/**
 * Modify a URL.
 *
 * Example: changing the URL pathname for internationalization.
 *
 * https://vike.dev/modifyUrl
 */
function modifyUrl(
  url: string,
  modify: ModifyUrlSameOriginOptions & {
    hostname?: string
    port?: number
    protocol?: string
  }
): string {
  url = modifyUrlSameOrigin(url, modify)
  const urlParsed = parseUrl(url, '/')

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
    urlParsed.pathname,
    urlParsed.searchOriginal,
    urlParsed.hashOriginal
  )
  return urlModified
}
