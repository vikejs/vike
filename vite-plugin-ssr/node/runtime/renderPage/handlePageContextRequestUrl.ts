export { handlePageContextRequestUrl }

import { pageContextJsonFileExtension, doNotCreateExtraDirectory } from '../../../shared/getPageContextRequestUrl'
import { baseServer, parseUrl, assert, slice } from '../utils'

// See shared/getPageContextRequestUrl.ts
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
  const { pathnameOriginal, pathname } = parseUrl(url, baseServer)
  assert(pathnameOriginal.endsWith(pageContextJsonFileExtension) === pathname.endsWith(pageContextJsonFileExtension), {
    url
  })
  return pathnameOriginal.endsWith(pageContextJsonFileExtension)
}

function removePageContextUrlSuffix(url: string): string {
  const urlParsed = parseUrl(url, baseServer)
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
