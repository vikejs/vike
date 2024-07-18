// We don't use new URL() as it doesn't exactly do what we need, for example:
//  - It loses the original URL parts (which we need to manipulate and recreate URLs)
//  - It doesn't support the tauri:// protocol

// Unit tests at ./parseUrl.spec.ts

export { parseUrl }
export { assertUsageUrlPathnameAbsolute }
export { assertUsageUrlRedirectTarget }
export { isUrl }
export { isUri }
export { isUrlRedirectTarget }
export { isBaseServer }
export { assertUrlComponents }
export { createUrlFromComponents }

import { slice } from './slice.js'
import { assert, assertUsage } from './assert.js'
import pc from '@brillout/picocolors'

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
  assert(
    isUrl(url),
    // Eventually remove debug log once URL handling is stable
    { url }
  )
  assert(baseServer.startsWith('/'))

  // Hash
  const [urlWithoutHash, ...hashList] = url.split('#')
  assert(urlWithoutHash !== undefined)
  const hashOriginal = ['', ...hashList].join('#') || null
  assert(hashOriginal === null || hashOriginal.startsWith('#'))
  const hash = hashOriginal === null ? '' : decodeSafe(hashOriginal.slice(1))

  // Search
  const [urlWithoutHashNorSearch, ...searchList] = urlWithoutHash.split('?')
  assert(urlWithoutHashNorSearch !== undefined)
  const searchOriginal = ['', ...searchList].join('?') || null
  assert(searchOriginal === null || searchOriginal.startsWith('?'))
  const search: Record<string, string> = {}
  const searchAll: Record<string, string[]> = {}
  Array.from(new URLSearchParams(searchOriginal || '')).forEach(([key, val]) => {
    search[key] = val
    searchAll[key] = [...(searchAll.hasOwnProperty(key) ? searchAll[key]! : []), val]
  })

  // Origin + pathname
  const { origin, pathname: pathnameResolved } = getPathname(urlWithoutHashNorSearch, baseServer)
  assert(origin === null || origin === decodeSafe(origin)) // AFAICT decoding the origin is useless
  assert(pathnameResolved.startsWith('/'))
  assert(origin === null || url.startsWith(origin))

  // `pathnameOriginal`
  const pathnameOriginal = urlWithoutHashNorSearch.slice((origin || '').length)

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
  urlPathname = urlPathname.replace(/\s+$/, '')
  urlPathname = urlPathname
    .split('/')
    .map((dir) => decodeSafe(dir).split('/').join('%2F'))
    .join('/')
  return urlPathname
}
function getPathname(url: string, baseServer: string): { origin: null | string; pathname: string } {
  // Search and hash already extracted
  assert(!url.includes('?') && !url.includes('#'))

  // url has origin
  {
    const { origin, pathname } = parseOrigin(url)
    if (origin) {
      return { origin, pathname }
    }
    assert(pathname === url)
  }

  // url doesn't have origin
  if (url.startsWith('/')) {
    return { origin: null, pathname: url }
  } else {
    // url is a relative path

    // In the browser, this is the Base URL of the current URL.
    // Safe access `window?.document?.baseURI` for users who shim `window` in Node.js
    const baseURI: string | undefined = typeof window !== 'undefined' ? window?.document?.baseURI : undefined

    let base: string
    if (baseURI) {
      const baseURIPathaname = parseOrigin(baseURI.split('?')[0]!).pathname
      base = baseURIPathaname
    } else {
      base = baseServer
    }

    const pathname = resolveUrlPathnameRelative(url, base)
    return { origin: null, pathname }
  }
}
function parseOrigin(url: string): { pathname: string; origin: null | string } {
  if (!isUrlWithProtocol(url)) {
    return { pathname: url, origin: null }
  } else {
    const { protocol, uriWithoutProtocol } = parseProtocol(url)
    assert(protocol)
    const [hostname, ...rest] = uriWithoutProtocol.split('/')
    const origin = protocol + hostname!
    const pathname = '/' + rest.join('/')
    return { origin, pathname }
  }
}
function parseProtocol(uri: string) {
  const SEP = ':'
  const [before, ...after] = uri.split(SEP)
  if (
    after.length === 0 ||
    // https://github.com/vikejs/vike/commit/886a99ff21e86a8ca699a25cee7edc184aa058e4#r143308934
    // https://en.wikipedia.org/wiki/List_of_URI_schemes
    // https://www.rfc-editor.org/rfc/rfc7595
    !/^[a-z][a-z0-9\+\-]*$/i.test(before!)
  ) {
    return { protocol: null, uriWithoutProtocol: uri }
  }
  let protocol = before! + SEP
  let uriWithoutProtocol = after.join(SEP)
  const SEP2 = '//'
  if (uriWithoutProtocol.startsWith(SEP2)) {
    protocol = protocol + SEP2
    uriWithoutProtocol = uriWithoutProtocol.slice(SEP2.length)
  }
  return { protocol, uriWithoutProtocol }
}
function isUrlProtocol(protocol: string) {
  return protocol.endsWith('://')
}
// Adapted from https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript/14780463#14780463
function resolveUrlPathnameRelative(pathnameRelative: string, base: string) {
  const stack = base.split('/')
  const parts = pathnameRelative.split('/')
  let baseRestoreTrailingSlash = base.endsWith('/')
  if (pathnameRelative.startsWith('.')) {
    // remove current file name
    stack.pop()
  }
  for (const i in parts) {
    const p = parts[i]!
    if (p == '' && i === '0') continue
    if (p == '.') continue
    if (p == '..') stack.pop()
    else {
      baseRestoreTrailingSlash = false
      stack.push(p)
    }
  }
  let pathnameAbsolute = stack.join('/')
  if (baseRestoreTrailingSlash && !pathnameAbsolute.endsWith('/')) pathnameAbsolute += '/'
  if (!pathnameAbsolute.startsWith('/')) pathnameAbsolute = '/' + pathnameAbsolute
  return pathnameAbsolute
}

function analyzeBaseServer(
  urlPathnameWithBase: string,
  baseServer: string
): { pathname: string; hasBaseServer: boolean } {
  assert(urlPathnameWithBase.startsWith('/'))
  assert(!urlPathnameWithBase.includes('?'))
  assert(!urlPathnameWithBase.includes('#'))
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
  assert(url === urlRecreated)
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

function isUrl(url: string): boolean {
  // parseUrl() works with these URLs
  return isUrlWithProtocol(url) || url.startsWith('/') || isUrlPathnameRelative(url)
}
function isUrlRedirectTarget(url: string): boolean {
  return url.startsWith('/') || isUri(url) || isUrlWithProtocol(url)
}
function isUrlPathnameRelative(url: string) {
  return ['.', '?', '#'].some((c) => url.startsWith(c)) || url === ''
}
/**
 * URIs that aren't URLs.
 *
 * Real-world examples:
 *    mailto:
 *    ipfs:
 *    magnet:
 *
 * We need to treat URIs differently than URLs.
 *  - For exmaple, we cannot parse URIs (their structure is unknown e.g. a `magnet:` URI is completely different than a `http://` URL).
 *    - The protocols tauri:// file:// capacitor:// follow the same structure as http:// and https:// URLs.
 *      - Thus we can parse them like http:// and https:// URLs.
 *  - So far, checking whether the protocol ends with :// seems to be a reliable way to distinguish URIs from URLs.
 *    - If it turns out to be unreliable, then use a whitelist ['tauri://', 'file://', 'capacitor://', 'http://', 'https://']
 */
function isUri(uri: string): boolean {
  const { protocol } = parseProtocol(uri)
  return !!protocol && !isUrlProtocol(uri)
}
/**
 * URL with protocol.
 *
 * Real-world examples:
 *    http://
 *    https://
 *    tauri://         [Tauri](https://tauri.app)
 *    file://          [Electron](https://github.com/vikejs/vike/issues/1557)
 *    capacitor://     [Capacitor](https://github.com/vikejs/vike/issues/1706)
 */
function isUrlWithProtocol(url: string): boolean {
  const { protocol } = parseProtocol(url)
  return !!protocol && isUrlProtocol(protocol)
}

function assertUsageUrlPathnameAbsolute(url: string, errPrefix: string): void {
  assertUsageUrl(url, errPrefix, { allowRelative: true })
}
function assertUsageUrlRedirectTarget(url: string, errPrefix: string): void {
  assertUsageUrl(url, errPrefix, { isRedirectTarget: true })
}
function assertUsageUrl(
  url: string,
  errPrefix: string,
  { allowRelative, isRedirectTarget }: { allowRelative?: true; isRedirectTarget?: true } = {}
) {
  if (url.startsWith('/')) return
  let errMsg = `${errPrefix} is ${pc.code(url)} but it should start with ${pc.code('/')}`
  if (isRedirectTarget) {
    if (isUrlRedirectTarget(url)) return
    errMsg += ` or a protocol (${pc.bold('https://')}, ${pc.bold('ipfs:')}, ...)`
  }
  if (allowRelative) {
    if (isUrlPathnameRelative(url)) return
    errMsg += ' or be a relative URL'
  }
  assertUsage(false, errMsg)
}
