export { handlePageContextRequestUrl }

import { pageContextJsonFileExtension, doNotCreateExtraDirectory } from '../../../shared/getPageContextRequestUrl.js'
import { baseServer, parseUrl, assert, slice } from '../utils.js'

type UrlParsed = ReturnType<typeof parseUrl>

// See also shared/getPageContextRequestUrl.ts
function handlePageContextRequestUrl(url: string): {
  urlWithoutPageContextRequestSuffix: string
  isPageContextJsonRequest: boolean
} {
  const urlParsed = parseUrl(url, baseServer)
  if (!hasSuffix(urlParsed)) {
    return { urlWithoutPageContextRequestSuffix: url, isPageContextJsonRequest: false }
  }
  return {
    urlWithoutPageContextRequestSuffix: removePageContextUrlSuffix(urlParsed, url),
    isPageContextJsonRequest: true,
  }
}

function hasSuffix(urlParsed: UrlParsed) {
  const { pathnameOriginal, pathname } = urlParsed
  assert(pathname.endsWith(pageContextJsonFileExtension) === pathnameOriginal.endsWith(pageContextJsonFileExtension))
  return pathname.endsWith(pageContextJsonFileExtension)
}

function removePageContextUrlSuffix(urlParsed: UrlParsed, url: string): string {
  // We cannot use `urlParsed.pathname` because it would break the `urlParsed.pathnameOriginal` value of subsequent `parseUrl()` calls.
  const { origin, pathnameOriginal, searchOriginal, hashOriginal } = urlParsed
  assert(doNotCreateExtraDirectory === false)
  const urlSuffix = `/index${pageContextJsonFileExtension}`
  assert(pathnameOriginal.endsWith(urlSuffix), { url })
  let pathnameModified = slice(pathnameOriginal, 0, -1 * urlSuffix.length)
  if (pathnameModified === '') pathnameModified = '/'
  assert(url === `${origin || ''}${pathnameOriginal}${searchOriginal || ''}${hashOriginal || ''}`, { url })
  return `${origin || ''}${pathnameModified}${searchOriginal || ''}${hashOriginal || ''}`
}
