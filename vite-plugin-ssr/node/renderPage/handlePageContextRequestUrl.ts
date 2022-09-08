export { handlePageContextRequestUrl }

import { fileExtension, doNotCreateExtraDirectory } from '../../shared/getPageContextRequestUrl'
import { baseUrl, parseUrl, assert, slice } from '../utils'

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
  const { pathnameOriginal, pathname } = parseUrl(url, baseUrl)
  assert(pathnameOriginal.endsWith(fileExtension) === pathname.endsWith(fileExtension), { url })
  return pathnameOriginal.endsWith(fileExtension)
}

function removePageContextUrlSuffix(url: string): string {
  const urlParsed = parseUrl(url, baseUrl)
  // We cannot use `urlParsed.pathname` because it would break the `urlParsed.pathnameOriginal` value of subsequent `parseUrl()` calls.
  const { origin, pathnameOriginal, searchOriginal, hashOriginal } = urlParsed
  assert(doNotCreateExtraDirectory === false)
  const urlSuffix = `/index${fileExtension}`
  assert(pathnameOriginal.endsWith(urlSuffix), { url })
  let pathnameModified = slice(pathnameOriginal, 0, -1 * urlSuffix.length)
  if (pathnameModified === '') pathnameModified = '/'
  assert(url === `${origin || ''}${pathnameOriginal}${searchOriginal || ''}${hashOriginal || ''}`, { url })
  return `${origin || ''}${pathnameModified}${searchOriginal || ''}${hashOriginal || ''}`
}
