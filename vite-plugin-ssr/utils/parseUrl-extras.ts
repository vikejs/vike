export { prependBase }
export { isBaseAssets }
export { normalizeUrlPathname }

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
  const { origin, pathnameOriginal, searchOriginal, hashOriginal } = parseUrl(urlOriginal, '/')
  assert(pathnameOriginal.startsWith('/'))
  const pathnameNormalized = '/' + pathnameOriginal.split('/').filter(Boolean).join('/')
  if (pathnameOriginal === pathnameNormalized) return null
  assertUrlComponents(urlOriginal, origin, pathnameOriginal, searchOriginal, hashOriginal)
  const urlNormalized = createUrlFromComponents(origin, pathnameNormalized, searchOriginal, hashOriginal)
  return urlNormalized
}
