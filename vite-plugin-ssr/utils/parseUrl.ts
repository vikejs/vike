// Unit tests at ./parseUrl.spec.ts

export { parseUrl }
export { isParsable }
export { assertUsageUrl }
export { isBaseServer }
export { assertUrlComponents }
export { createUrlFromComponents }

import { slice } from './slice.js'
import { assert, assertUsage } from './assert.js'

function isParsable(url: string): boolean {
  // `parseUrl()` works with these URLs
  return (
    url.startsWith('/') ||
    url.startsWith('http') ||
    url.startsWith('tauri://') ||
    url.startsWith('.') ||
    url.startsWith('?') ||
    url.startsWith('#') ||
    url === ''
  )
}
function assertUsageUrl(url: unknown, errPrefix: string): asserts url is string {
  assert(errPrefix.includes(' but '))
  assertUsage(typeof url === 'string', `${errPrefix} should be a string`)
  if (isParsable(url)) return
  if (!url.startsWith('/') && !url.includes(':')) {
    assertUsage(
      false,
      `${errPrefix} is '${url}' and it should be '/${url}' instead (URL pathnames should start with a leading slash)`
    )
  } else {
    assertUsage(false, `${errPrefix} isn't a valid URL`)
  }
}

function parseUrl(
  url: string,
  baseServer: string
): {
  origin: null | string
  pathname: string
  pathnameOriginal: string
  hasBaseServer: boolean
  search: Record<string, string>
  searchAll: Record<string, string[]>
  searchOriginal: null | string
  hash: string
  hashOriginal: null | string
} {
  assert(isParsable(url), { url })
  assert(baseServer.startsWith('/'), { url, baseServer })

  // Hash
  const [urlWithoutHash, ...hashList] = url.split('#')
  assert(urlWithoutHash !== undefined)
  const hashOriginal = ['', ...hashList].join('#') || null
  assert(hashOriginal === null || hashOriginal.startsWith('#'))
  const hash = hashOriginal === null ? '' : decodeSafe(hashOriginal.slice(1))

  // Search
  const [urlWithoutSearch, ...searchList] = urlWithoutHash.split('?')
  assert(urlWithoutSearch !== undefined)
  const searchOriginal = ['', ...searchList].join('?') || null
  assert(searchOriginal === null || searchOriginal.startsWith('?'), { url, searchOriginal })
  const search: Record<string, string> = {}
  const searchAll: Record<string, string[]> = {}
  Array.from(new URLSearchParams(searchOriginal || '')).forEach(([key, val]) => {
    search[key] = val
    searchAll[key] = [...(searchAll[key] || []), val]
  })

  // Origin + pathname
  const { origin, pathnameResolved } = parseWithNewUrl(urlWithoutSearch, baseServer)
  assert(origin === null || origin === decodeSafe(origin), { origin }) // AFAICT decoding the origin is useless
  assert(pathnameResolved.startsWith('/'), { url, pathnameResolved })
  assert(origin === null || url.startsWith(origin), { url, origin })

  // `pathnameOriginal`
  const pathnameOriginal = urlWithoutSearch.slice((origin || '').length)

  assertUrlComponents(url, origin, pathnameOriginal, searchOriginal, hashOriginal)

  // Base URL
  let { pathname, hasBaseServer } = analyzeBaseServer(pathnameResolved, baseServer)
  pathname = decodePathname(pathname)

  assert(pathname.startsWith('/'))
  return {
    origin,
    pathname,
    pathnameOriginal: pathnameOriginal,
    hasBaseServer,
    search,
    searchAll,
    searchOriginal,
    hash,
    hashOriginal
  }
}
function decodeSafe(urlComponent: string): string {
  try {
    return decodeURIComponent(urlComponent)
  } catch {}
  try {
    return decodeURI(urlComponent)
  } catch {}
  return urlComponent
}
function decodePathname(urlPathname: string) {
  return urlPathname
    .split('/')
    .map((dir) => decodeSafe(dir).split('/').join('%2F'))
    .join('/')
}
function parseWithNewUrl(urlWithoutSearch: string, baseServer: string) {
  // `new URL('//', 'https://example.org')` throws `ERR_INVALID_URL`
  if (urlWithoutSearch.startsWith('//')) {
    return { origin: null, pathnameResolved: urlWithoutSearch }
  }

  let isTauriProtocol = false
  const PROTOCOL_TAURI = 'tauri://'
  const PROTOCOL_FAKE = 'http://'
  if (urlWithoutSearch.startsWith(PROTOCOL_TAURI)) {
    isTauriProtocol = true
    urlWithoutSearch = PROTOCOL_FAKE + urlWithoutSearch.slice(PROTOCOL_TAURI.length)
  }

  let origin: string | null
  let pathnameResolved: string
  try {
    // `new URL(url)` throws an error if `url` doesn't have an origin
    const urlParsed = new URL(urlWithoutSearch)
    origin = urlParsed.origin
    pathnameResolved = urlParsed.pathname
  } catch (err) {
    // `url` has no origin
    origin = null
    // In the browser, this is the Base URL of the current URL
    let base =
      typeof window !== 'undefined' &&
      // We need to access safely in case the user sets `window` in Node.js
      window?.document?.baseURI
    base = base || 'http://fake.example.org' + baseServer
    // `new Url()` supports:
    //  - `url === '/absolute/path'`
    //  - `url === './relative/path'`
    //  - `url === '?queryWithoutPath'`
    //  - `url === '''`
    // `base` in `new URL(url, base)` is used for resolving relative paths (`new URL()` doesn't remove `base` from `pathname`)
    const urlParsed = new URL(urlWithoutSearch, base)
    pathnameResolved = urlParsed.pathname
  }

  if (!pathnameResolved) pathnameResolved = '/'

  if (isTauriProtocol) {
    assert(origin)
    assert(origin.startsWith(PROTOCOL_FAKE))
    origin = PROTOCOL_TAURI + origin.slice(PROTOCOL_FAKE.length)
  }

  assert(pathnameResolved.startsWith('/'), { urlWithoutSearch, pathnameResolved })
  // The URL pathname should be the URL without origin, query string, and hash.
  //  - https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname
  assert(pathnameResolved === pathnameResolved.split('?')[0]!.split('#')[0])

  return { origin, pathnameResolved }
}

/* Not needed anymore?
function assertUsageBaseServer(baseServer: string, usageErrorMessagePrefix: string = '') {
  assertUsage(
    !baseServer.startsWith('http'),
    usageErrorMessagePrefix +
      '`base` is not allowed to start with `http`. Consider using `baseAssets` instead, see https://vite-plugin-ssr.com/base-url'
  )
  assertUsage(
    baseServer.startsWith('/'),
    usageErrorMessagePrefix + 'Wrong `base` value `' + baseServer + '`; `base` should start with `/`.'
  )
  assert(isBaseServer(baseServer))
}
*/

function assertPathname(urlPathname: string) {
  assert(urlPathname.startsWith('/'))
  assert(!urlPathname.includes('?'))
  assert(!urlPathname.includes('#'))
}

function analyzeBaseServer(
  urlPathnameWithBase: string,
  baseServer: string
): { pathname: string; hasBaseServer: boolean } {
  assertPathname(urlPathnameWithBase)
  assert(isBaseServer(baseServer))

  // Mutable
  let urlPathname = urlPathnameWithBase

  assert(urlPathname.startsWith('/'))
  assert(baseServer.startsWith('/'))

  if (baseServer === '/') {
    const pathname = urlPathnameWithBase
    return { pathname, hasBaseServer: true }
  }

  // Support `url === '/some-base-url' && baseServer === '/some-base-url/'`
  let baseServerNormalized = baseServer
  if (baseServer.endsWith('/') && urlPathname === slice(baseServer, 0, -1)) {
    baseServerNormalized = slice(baseServer, 0, -1)
    assert(urlPathname === baseServerNormalized)
  }

  if (!urlPathname.startsWith(baseServerNormalized)) {
    const pathname = urlPathnameWithBase
    return { pathname, hasBaseServer: false }
  }
  assert(urlPathname.startsWith('/') || urlPathname.startsWith('http'))
  assert(urlPathname.startsWith(baseServerNormalized))
  urlPathname = urlPathname.slice(baseServerNormalized.length)
  if (!urlPathname.startsWith('/')) urlPathname = '/' + urlPathname

  assert(urlPathname.startsWith('/'))
  return { pathname: urlPathname, hasBaseServer: true }
}

function isBaseServer(baseServer: string): boolean {
  return baseServer.startsWith('/')
}

function assertUrlComponents(
  url: string,
  origin: string | null,
  pathname: string,
  searchOriginal: string | null,
  hashOriginal: string | null
) {
  const urlRecreated = createUrlFromComponents(origin, pathname, searchOriginal, hashOriginal)
  assert(url === urlRecreated, { url, urlRecreated })
}
function createUrlFromComponents(
  origin: string | null,
  pathname: string,
  searchOriginal: string | null,
  hashOriginal: string | null
) {
  const urlRecreated = `${origin || ''}${pathname}${searchOriginal || ''}${hashOriginal || ''}`
  return urlRecreated
}
