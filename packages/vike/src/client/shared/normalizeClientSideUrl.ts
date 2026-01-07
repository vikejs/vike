import '../assertEnvClient.js'

export { normalizeClientSideUrl }

import { assert } from '../../utils/assert.js'
import { parseUrl } from '../../utils/parseUrl.js'

/** Resolves relative URLs */
function normalizeClientSideUrl(url: string, options?: { withoutHash: true }): `/${string}` {
  // This function doesn't work for `url === '#some-hash'` because `searchOriginal` will be missing: if window.location.href has a search string then it's going to be missing in the returned `urlCurrent` value because `parseUrl(url)` returns `searchOriginal: null` since there isn't any search string in `url`.
  // - Maybe `const { searchOriginal } = parseUrl(window.location.href)` can be a fix. (Let's check how `normalizeClientSideUrl()` is being used.)
  assert(!url.startsWith('#'))

  const { searchOriginal, hashOriginal, pathname } = parseUrl(url, '/')
  let urlCurrent = `${pathname}${searchOriginal || ''}`
  if (!options?.withoutHash) urlCurrent += hashOriginal || ''

  assert(urlCurrent.startsWith('/'))
  return urlCurrent as `/${string}`
}
