// We don't use new URL() as it doesn't exactly do what we need, for example:
//  - It loses the original URL parts (which we need to manipulate and recreate URLs)
//  - It doesn't support the tauri:// protocol

// Unit tests at ./parseUrl.spec.ts

export { parseUrl }
export { isParsable }
export { assertUsageUrl }
export { isBaseServer }
export { assertUrlComponents }
export { createUrlFromComponents }

import { slice } from './slice.js'
import { assert, assertUsage } from './assert.js'
import pc from '@brillout/picocolors'

const PROTOCOLS = ['http://', 'https://', 'tauri://']

function isParsable(url: string): boolean {
  // `parseUrl()` works with these URLs
  return (
    PROTOCOLS.some((p) => url.startsWith(p)) ||
    url.startsWith('/') ||
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
      `${errPrefix} is ${pc.cyan(url)} and it should be /${pc.cyan(
        url
      )} instead (URL pathnames should start with a leading slash)`
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
  assert(isParsable(url))
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
  const { origin, pathname: pathnameResolved } = parsePathname(urlWithoutHashNorSearch, baseServer)
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
  urlPathname = urlPathname
    .split('/')
    .map((dir) => decodeSafe(dir).split('/').join('%2F'))
    .join('/')
  urlPathname = urlPathname.replace(/\s/g, '')
  return urlPathname
}
function parsePathname(
  urlWithoutHashNorSearch: string,
  baseServer: string
): { origin: null | string; pathname: string } {
  {
    const { origin, pathname } = parseOrigin(urlWithoutHashNorSearch)
    if (origin) {
      return { origin, pathname }
    }
    assert(pathname === urlWithoutHashNorSearch)
  }

  if (urlWithoutHashNorSearch.startsWith('/')) {
    return { origin: null, pathname: urlWithoutHashNorSearch }
  } else {
    // In the browser, this is the Base URL of the current URL
    // Safe access `window?.document?.baseURI` for users who shim `window` in Node.js
    const baseURI: string | undefined = typeof window !== 'undefined' ? window?.document?.baseURI : undefined
    let base: string
    if (baseURI) {
      const baseURIPathaname = parseOrigin(baseURI.split('?')[0]!).pathname
      base = baseURIPathaname
    } else {
      base = baseServer
    }
    const pathname = resolveUrlPathnameRelative(urlWithoutHashNorSearch, base)
    // We need to parse the origin in case `base === window.document.baseURI`
    const parsed = parseOrigin(pathname)
    return parsed
  }
}

function parseOrigin(url: string): { pathname: string; origin: null | string } {
  if (!PROTOCOLS.some((protocol) => url.startsWith(protocol))) {
    return { pathname: url, origin: null }
  } else {
    const [originPart1, originPart2, originPart3, ...pathnameParts] = url.split('/')
    const origin = [originPart1, originPart2, originPart3].join('/')
    const pathname = ['', ...pathnameParts].join('/') || '/'
    return { origin, pathname }
  }
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

/* Not needed anymore?
function assertUsageBaseServer(baseServer: string, usageErrorMessagePrefix: string = '') {
  assertUsage(
    !baseServer.startsWith('http'),
    usageErrorMessagePrefix +
      '`base` is not allowed to start with `http`. Consider using `baseAssets` instead, see https://vike.dev/base-url'
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
