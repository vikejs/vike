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
export { isUrlRelative }
export { isUrlExternal }
export { isBaseServer }
export { assertUrlComponents }
export { createUrlFromComponents }
export type { UrlPublic }

import { slice } from './slice.js'
import { assert, assertUsage } from './assert.js'
import pc from '@brillout/picocolors'

type UrlPublic = {
  /** The full URL. */
  href: string
  /** The URL protocol, e.g. `https://` in `https://example.com` */
  protocol: null | string
  /** The URL hostname, e.g. `example.com` in `https://example.com/product` and `localhost` in `http://localhost:3000/product` */
  hostname: null | string
  /** The URL host port, e.g. `3000` in `http://localhost:3000/product` */
  port: null | number
  /** The URL origin, e.g. `https://example.com` in `https://example.com/product/42` */
  origin: null | string
  /** The URL pathname, e.g. `/product/42` in `https://example.com/product/42?details=yes#reviews` */
  pathname: string
  /** URL pathname including the Base URL, e.g. `/some-base-url/product/42` in `https://example.com/some-base-url/product/42` (whereas `pageContext.urlParsed.pathname` is `/product/42`) */
  pathnameOriginal: string
  /** The URL search parameters, e.g. `{ details: 'yes' }` for `https://example.com/product/42?details=yes#reviews` */
  search: Record<string, string>
  /** The URL search parameters array, e.g. `{ fruit: ['apple', 'orange'] }` for `https://example.com?fruit=apple&fruit=orange` **/
  searchAll: Record<string, string[]>
  /**
   * URL search parameters (aka query params).
   *
   * As `URLSearchParams`, e.g. `new URLSearchParams([['fruit','apple'],['fruit','orange']])` for `https://example.com?fruit=apple&fruit=orange`
   *
   * https://vike.dev/pageContext
   */
  searchParams: URLSearchParams
  /** The URL search parameterer string, e.g. `?details=yes` in `https://example.com/product/42?details=yes#reviews` */
  searchOriginal: null | `?${string}`
  /** The URL hash, e.g. `reviews` in `https://example.com/product/42?details=yes#reviews` */
  hash: string
  /** The URL hash string, e.g. `#reviews` in `https://example.com/product/42?details=yes#reviews` */
  hashOriginal: null | `#${string}`

  // TODO/v1-release: remove
  /** @deprecated */
  hashString: null | string
  /** @deprecated */
  searchString: null | string
}

type UrlInternal = Omit<UrlPublic, 'hashString' | 'searchString'> & { isBaseMissing: boolean }
function parseUrl(url: string, baseServer: string): UrlInternal {
  assert(isUrl(url), url)
  assert(baseServer.startsWith('/'))

  // Hash
  const { hashString: hashOriginal, withoutHash: urlWithoutHash } = extractHash(url)
  assert(hashOriginal === null || hashOriginal.startsWith('#'))
  const hash = hashOriginal === null ? '' : decodeSafe(hashOriginal.slice(1))

  // Search
  const { searchString: searchOriginal, withoutSearch: urlWithoutHashNorSearch } = extractSearch(urlWithoutHash)
  assert(searchOriginal === null || searchOriginal.startsWith('?'))
  let searchString = ''
  if (searchOriginal !== null) {
    searchString = searchOriginal
  } else if (url.startsWith('#')) {
    const baseURI = getBaseURI()
    searchString = (baseURI && extractSearch(baseURI).searchString) || ''
  }
  const search: Record<string, string> = {}
  const searchAll: Record<string, string[]> = {}
  const searchParams = new URLSearchParams(searchString)
  Array.from(searchParams).forEach(([key, val]) => {
    search[key] = val
    searchAll[key] = [...(searchAll.hasOwnProperty(key) ? searchAll[key]! : []), val]
  })

  // Origin + pathname
  let { protocol, origin, pathnameAbsoluteWithBase } = getPathnameAbsoluteWithBase(urlWithoutHashNorSearch, baseServer)
  const pathnameOriginal = urlWithoutHashNorSearch.slice((origin || '').length)
  assertUrlComponents(url, origin, pathnameOriginal, searchOriginal, hashOriginal)

  // Base URL
  let { pathname, isBaseMissing } = removeBaseServer(pathnameAbsoluteWithBase, baseServer)

  // pageContext.urlParsed.href
  const href = createUrlFromComponents(origin, pathname, searchOriginal, hashOriginal)

  // pageContext.urlParsed.{hostname, port}
  const host = !origin ? null : origin.slice(protocol!.length)
  const { hostname, port } = parseHost(host, url)

  // decode after setting href
  pathname = decodePathname(pathname)

  assert(pathname.startsWith('/'))
  return {
    href,
    protocol,
    hostname,
    port,
    origin,
    pathname,
    pathnameOriginal: pathnameOriginal,
    isBaseMissing,
    search,
    searchAll,
    searchParams,
    searchOriginal,
    hash,
    hashOriginal
  }
}

function extractHash(url: string) {
  const [withoutHash, ...parts] = url.split('#')
  const hashString = (['', ...parts].join('#') as undefined | `#${string}`) || null
  return { hashString, withoutHash: withoutHash as string }
}
function extractSearch(url: string) {
  const [withoutSearch, ...parts] = url.split('?')
  const searchString = (['', ...parts].join('?') as undefined | `?${string}`) || null
  return { searchString, withoutSearch: withoutSearch as string }
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

function getPathnameAbsoluteWithBase(
  url: string,
  baseServer: string
): { origin: null | string; pathnameAbsoluteWithBase: string; protocol: null | string } {
  // Search and hash already extracted
  assert(!url.includes('?') && !url.includes('#'))

  // url has origin
  {
    const { protocol, origin, pathname } = parseOrigin(url)
    if (origin) {
      return { protocol, origin, pathnameAbsoluteWithBase: pathname }
    }
    assert(pathname === url)
  }

  // url doesn't have origin
  if (url.startsWith('/')) {
    return { protocol: null, origin: null, pathnameAbsoluteWithBase: url }
  } else {
    // url is a relative path

    const baseURI = getBaseURI()
    let base: string
    if (baseURI) {
      base = parseOrigin(baseURI.split('?')[0]!.split('#')[0]!).pathname
    } else {
      base = baseServer
    }

    const pathnameAbsoluteWithBase = resolveUrlPathnameRelative(url, base)
    return { protocol: null, origin: null, pathnameAbsoluteWithBase }
  }
}
function getBaseURI() {
  // In the browser, this is the Base URL of the current URL.
  // Safe access `window?.document?.baseURI` for users who shim `window` in Node.js
  const baseURI: string | undefined = typeof window !== 'undefined' ? window?.document?.baseURI : undefined
  return baseURI
}
function parseOrigin(url: string): { pathname: string; origin: null | string; protocol: null | string } {
  if (!isUrlWithProtocol(url)) {
    return { pathname: url, origin: null, protocol: null }
  } else {
    const { protocol, uriWithoutProtocol } = parseProtocol(url)
    assert(protocol)
    const [host, ...rest] = uriWithoutProtocol.split('/')
    const origin = protocol + host!
    const pathname = '/' + rest.join('/')
    return { pathname, origin, protocol }
  }
}
function parseHost(host: string | null, url: string) {
  const ret: { hostname: string | null; port: number | null } = { hostname: null, port: null }
  if (!host) return ret

  // port
  const parts = host.split(':')
  if (parts.length > 1) {
    const port = parseInt(parts.pop()!, 10)
    assert(port || port === 0, url)
    ret.port = port
  }

  // hostname
  ret.hostname = parts.join(':')

  return ret
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
  // Is there an altenrative to having a blacklist?
  // - If the blacklist becomes too big, maybe use a whitelist instead ['tauri://', 'file://', 'capacitor://', 'http://', 'https://']
  const blacklist = [
    // https://docs.ipfs.tech/how-to/address-ipfs-on-web
    'ipfs://',
    'ipns://'
  ]
  if (blacklist.includes(protocol)) return false
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

function removeBaseServer(
  pathnameAbsoluteWithBase: string,
  baseServer: string
): { pathname: string; isBaseMissing: boolean } {
  assert(pathnameAbsoluteWithBase.startsWith('/'))
  assert(isBaseServer(baseServer))

  // Mutable
  let urlPathname = pathnameAbsoluteWithBase

  assert(urlPathname.startsWith('/'))
  assert(baseServer.startsWith('/'))

  if (baseServer === '/') {
    const pathname = pathnameAbsoluteWithBase
    return { pathname, isBaseMissing: false }
  }

  // Support `url === '/some-base-url' && baseServer === '/some-base-url/'`
  let baseServerNormalized = baseServer
  if (baseServer.endsWith('/') && urlPathname === slice(baseServer, 0, -1)) {
    baseServerNormalized = slice(baseServer, 0, -1)
    assert(urlPathname === baseServerNormalized)
  }

  if (!urlPathname.startsWith(baseServerNormalized)) {
    const pathname = pathnameAbsoluteWithBase
    return { pathname, isBaseMissing: true }
  }
  assert(urlPathname.startsWith('/') || urlPathname.startsWith('http'))
  assert(urlPathname.startsWith(baseServerNormalized))
  urlPathname = urlPathname.slice(baseServerNormalized.length)
  if (!urlPathname.startsWith('/')) urlPathname = '/' + urlPathname

  assert(urlPathname.startsWith('/'))
  return { pathname: urlPathname, isBaseMissing: false }
}
function isBaseServer(baseServer: string): boolean {
  return baseServer.startsWith('/')
}

function assertUrlComponents(
  url: string,
  origin: string | null,
  pathnameOriginal: string,
  searchOriginal: string | null,
  hashOriginal: string | null
): void {
  const urlRecreated = createUrlFromComponents(origin, pathnameOriginal, searchOriginal, hashOriginal)
  assert(url === urlRecreated)
}
function createUrlFromComponents(
  origin: string | null,
  pathname: string,
  search: string | null,
  hash: string | null
): string {
  const urlRecreated = `${origin || ''}${pathname}${search || ''}${hash || ''}`
  return urlRecreated
}

function isUrl(url: string): boolean {
  // parseUrl() works with these URLs
  return isUrlWithProtocol(url) || url.startsWith('/') || isUrlRelative(url)
}
function isUrlRedirectTarget(url: string): boolean {
  return url.startsWith('/') || isUri(url) || isUrlWithProtocol(url)
}
function isUrlRelative(url: string) {
  return ['.', '?', '#'].some((c) => url.startsWith(c)) || url === ''
}
function isUrlExternal(url: string): boolean {
  return !url.startsWith('/') && !isUrlRelative(url)
}
/*
URL with protocol.

  http://example.com
  https://exmaple.com
  tauri://localhost
  file://example.com
  capacitor://localhost/assets/chunks/chunk-DJBYDrsP.js

[Tauri](https://github.com/vikejs/vike/issues/808)
[Electron (`file://`)](https://github.com/vikejs/vike/issues/1557)
[Capacitor](https://github.com/vikejs/vike/issues/1706)
 */
function isUrlWithProtocol(url: string): boolean {
  const { protocol } = parseProtocol(url)
  return !!protocol && isUrlProtocol(protocol)
}
/*
URIs that aren't URLs.

  mailto:john@example.com

  ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki/Vincent_van_Gogh.html

  magnet:?xt=urn:btih:3a15e1ac49683d91b20c2ffc252ea612a6c01bd7&dn=The.Empire.Strikes.Back.1980.Remastered.1080p.BluRay.DDP.7.1.x265-EDGE2020.mkv&xl=3225443573&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.torrent.eu.org:451&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.openbittorrent.com:6969&tr=udp://tracker.tiny-vps.com:6969/announce&tr=udp://open.demonii.com:1337

We need to treat URIs differently than URLs.
 - For example, we cannot parse URIs (their structure is unknown e.g. a `magnet:` URI is completely different than a `http://` URL).
   - The protocols tauri:// file:// capacitor:// follow the same structure as http:// and https:// URLs.
     - Thus we can parse them like http:// and https:// URLs.
*/
function isUri(uri: string): boolean {
  const { protocol } = parseProtocol(uri)
  return !!protocol && !isUrlProtocol(uri)
}

function assertUsageUrlPathnameAbsolute(url: string, errPrefix: string): void {
  assertUsageUrl(url, errPrefix)
}
function assertUsageUrlRedirectTarget(url: string, errPrefix: string, isUnresolved?: true): void {
  assertUsageUrl(url, errPrefix, { isRedirectTarget: isUnresolved ? 'unresolved' : true })
}
function assertUsageUrl(
  url: string,
  errPrefix: string,
  { isRedirectTarget }: { isRedirectTarget?: true | 'unresolved' } = {}
) {
  if (url.startsWith('/')) return
  let errMsg = `${errPrefix} is ${pc.string(url)} but it should start with ${pc.string('/')}`
  if (isRedirectTarget) {
    if (isUrlRedirectTarget(url)) return
    errMsg += ` or a protocol (${pc.string('http://')}, ${pc.string('mailto:')}, ...)`
    if (isRedirectTarget === 'unresolved') {
      if (url === '*') return
      errMsg += `, or be ${pc.string('*')}`
    }
  }
  assertUsage(false, errMsg)
}
