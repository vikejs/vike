export { normalizeClientSideUrl }

import { assert, parseUrl } from './utils.js'

/** Resolves relative URLs */
function normalizeClientSideUrl(url: string, options?: { withoutHash: true }): `/${string}` {
  // This function doesn't work for `url === '#some-hash'` because `searchOriginal` is `null` even if window.location.href has a search string.
  // - Thus the resolved absolute URL would be missing the search string.
  // - It makes sense that `parseUrl()` returns `searchOriginal === null` since there isn't any search string in `url`.
  assert(!url.startsWith('#'))

  const { searchOriginal, hashOriginal, pathname } = parseUrl(url, '/')
  let urlCurrent = `${pathname}${searchOriginal || ''}`
  if (!options?.withoutHash) urlCurrent += hashOriginal || ''

  assert(urlCurrent.startsWith('/'))
  return urlCurrent as `/${string}`
}
