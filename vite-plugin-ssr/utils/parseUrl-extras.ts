export { prependBase }
export { isBaseAssets }
export { normalizeUrlPathname }
export { removeBaseServer }
export { modifyUrlPathname }

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
  const { hasBaseServer, origin, pathname, pathnameOriginal, searchOriginal, hashOriginal } = parseUrl(url, baseServer)
  assert(hasBaseServer)
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

function normalizeUrlPathname(urlOriginal: string): string | null {
  const urlNormalized = modifyUrlPathname(urlOriginal, (urlPathname) => {
    assert(urlPathname.startsWith('/'))
    const urlPathnameNormalized = '/' + urlPathname.split('/').filter(Boolean).join('/')
    return urlPathnameNormalized
  })
  if (urlNormalized === urlOriginal) return null
  return urlNormalized
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
