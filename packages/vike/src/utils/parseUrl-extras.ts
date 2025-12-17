export { prependBase }
export { isBaseAssets }
export { normalizeUrlPathname }
export { removeBaseServer }
export { modifyUrlPathname }
export { removeUrlOrigin }
export { setUrlOrigin }
export { getUrlPretty }

import { assertUrlComponents, createUrlFromComponents, isBaseServer, parseUrl } from './parseUrl.js'
import { assert } from './assert.js'
import { slice } from './slice.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser()

function prependBase(url: string, baseServer: string): string {
  if (baseServer.startsWith('http')) {
    const baseAssets = baseServer
    const baseAssetsNormalized = normalizeBaseAssets(baseAssets)
    assert(!baseAssetsNormalized.endsWith('/'))
    assert(url.startsWith('/'))
    return `${baseAssetsNormalized}${url}`
  }
  assert(isBaseServer(baseServer))

  const baseServerNormalized = normalizeBaseServer(baseServer)

  if (baseServerNormalized === '/') return url

  assert(!baseServerNormalized.endsWith('/'))
  assert(url.startsWith('/'))
  return `${baseServerNormalized}${url}`
}

function removeBaseServer(url: string, baseServer: string): string {
  const { isBaseMissing, origin, pathname, pathnameOriginal, searchOriginal, hashOriginal } = parseUrl(url, baseServer)
  assert(!isBaseMissing)
  assertUrlComponents(url, origin, pathnameOriginal, searchOriginal, hashOriginal)
  const urlWithoutBase = createUrlFromComponents(origin, pathname, searchOriginal, hashOriginal)
  return urlWithoutBase
}

function normalizeBaseAssets(baseAssets: string) {
  let baseAssetsNormalized = baseAssets
  if (baseAssetsNormalized.endsWith('/')) {
    baseAssetsNormalized = slice(baseAssetsNormalized, 0, -1)
  }
  assert(!baseAssetsNormalized.endsWith('/'))
  return baseAssetsNormalized
}

function normalizeBaseServer(baseServer: string) {
  let baseServerNormalized = baseServer
  if (baseServerNormalized.endsWith('/') && baseServerNormalized !== '/') {
    baseServerNormalized = slice(baseServerNormalized, 0, -1)
  }
  // We can and should expect `baseServer` to not contain `/` doublets.
  assert(!baseServerNormalized.endsWith('/') || baseServerNormalized === '/')
  return baseServerNormalized
}

function isBaseAssets(base: string): boolean {
  return base.startsWith('/') || base.startsWith('http://') || base.startsWith('https://')
}

function normalizeUrlPathname(urlOriginal: string, trailingSlash: boolean, baseServer: string): string | null {
  const urlNormalized = modifyUrlPathname(urlOriginal, (urlPathname) => {
    assert(urlPathname.startsWith('/'))
    let urlPathnameNormalized = normalize(urlPathname)
    if (urlPathnameNormalized === '/') {
      return urlPathnameNormalized
    }
    // If the Base URL has a trailing slash, then Vite (as of vite@5.0.0-beta.19) expects the root URL to also have a trailing slash, see https://github.com/vikejs/vike/issues/1258#issuecomment-1812226260
    if (baseServer.endsWith('/') && baseServer !== '/' && normalize(baseServer) === urlPathnameNormalized) {
      trailingSlash = true
    }
    assert(!urlPathnameNormalized.endsWith('/'))
    if (trailingSlash) {
      urlPathnameNormalized = urlPathnameNormalized + '/'
    }
    return urlPathnameNormalized
  })
  if (urlNormalized === urlOriginal) return null
  return urlNormalized
}
function normalize(urlPathname: string): string {
  assert(urlPathname.startsWith('/'))
  return '/' + urlPathname.split('/').filter(Boolean).join('/')
}

function modifyUrlPathname(url: string, modifier: (urlPathname: string) => string | null): string {
  const { origin, pathnameOriginal, searchOriginal, hashOriginal } = parseUrl(url, '/')
  const pathnameModified = modifier(pathnameOriginal)
  if (pathnameModified === null) return url
  assertUrlComponents(url, origin, pathnameOriginal, searchOriginal, hashOriginal)
  const urlModified = createUrlFromComponents(origin, pathnameModified, searchOriginal, hashOriginal)
  assert((pathnameOriginal === pathnameModified) === (url === urlModified))
  return urlModified
}

function removeUrlOrigin(url: string): { urlModified: string; origin: string | null } {
  const { origin, pathnameOriginal, searchOriginal, hashOriginal } = parseUrl(url, '/')
  const urlModified = createUrlFromComponents(null, pathnameOriginal, searchOriginal, hashOriginal)
  return { urlModified, origin }
}
function setUrlOrigin(url: string, origin: string | null): false | string {
  const { origin: originCurrent, pathnameOriginal, searchOriginal, hashOriginal } = parseUrl(url, '/')
  if (origin === originCurrent) return false
  assert(origin === null || origin.startsWith('http'))
  const urlModified = createUrlFromComponents(origin, pathnameOriginal, searchOriginal, hashOriginal)
  return urlModified
}

function getUrlPretty(url: string): string {
  const { urlModified } = removeUrlOrigin(url)
  return urlModified
}
