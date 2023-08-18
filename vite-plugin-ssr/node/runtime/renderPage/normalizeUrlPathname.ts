export { normalizeUrlPathname }

import { assert, assertUrlComponents, createUrl, parseUrl } from '../utils.js'

function normalizeUrlPathname(urlOriginal: string): string | null {
  const urlParsed = parseUrl(urlOriginal, '/')
  const { pathnameOriginal } = urlParsed
  assert(pathnameOriginal.startsWith('/'))
  const pathnameNormalized = '/' + pathnameOriginal.split('/').filter(Boolean).join('/')
  if (pathnameOriginal === pathnameNormalized) return null
  assertUrlComponents(urlOriginal, urlParsed.origin, pathnameOriginal, urlParsed.searchOriginal, urlParsed.hashOriginal)
  const urlNormalized = createUrl('', pathnameNormalized, urlParsed.searchOriginal, urlParsed.hashOriginal)
  return urlNormalized
}
