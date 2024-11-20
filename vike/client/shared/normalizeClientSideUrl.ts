export { normalizeClientSideUrl }

import { assert, parseUrl } from './utils.js'

/** Resolves relative URLs */
function normalizeClientSideUrl(url: string, options?: { withoutHash: true }): `/${string}` {
  const { searchOriginal, hashOriginal, pathname } = parseUrl(url, '/')
  let urlCurrent = `${pathname}${searchOriginal || ''}`
  if (!options?.withoutHash) urlCurrent += hashOriginal || ''
  assert(urlCurrent.startsWith('/'))
  return urlCurrent as `/${string}`
}
