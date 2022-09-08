export { handlePageContextRequestUrl }

import { baseUrl, parseUrl, assert, slice } from '../utils'

const suffix = '.pageContext.json'

function handlePageContextRequestUrl(url: string): {
  urlWithoutPageContextRequestSuffix: string
  isPageContextRequest: boolean
} {
  if (!hasSuffix(url)) {
    return { urlWithoutPageContextRequestSuffix: url, isPageContextRequest: false }
  }
  return { urlWithoutPageContextRequestSuffix: removePageContextUrlSuffix(url), isPageContextRequest: true }
}

function hasSuffix(url: string) {
  const { pathnameOriginal, pathname } = parseUrl(url, baseUrl)
  assert(pathnameOriginal.endsWith(suffix) === pathname.endsWith(suffix), { url })
  return pathnameOriginal.endsWith(suffix)
}

function removePageContextUrlSuffix(url: string): string {
  const urlParsed = parseUrl(url, baseUrl)
  const { origin, searchOriginal, hashOriginal } = urlParsed
  // We cannot use `urlParsed.pathname` because it would break the `urlParsed.pathnameOriginal` value of subsequent `parseUrl()` calls.
  let pathname = urlParsed.pathnameOriginal
  assert(pathname.endsWith(suffix), { url, pathname })
  assert(url === `${origin || ''}${pathname}${searchOriginal || ''}${hashOriginal || ''}`, { url })
  pathname = slice(pathname, 0, -1 * suffix.length)
  if (pathname === '/index') pathname = '/'
  return `${origin || ''}${pathname}${searchOriginal || ''}${hashOriginal || ''}`
}

