export { getFileUrl }
export { handlePageContextRequestSuffix }

import { parseUrl } from './parseUrl'
import { assert } from './assert'
import { slice } from './slice'
const suffix = '.pageContext.json'

// - When doing a `.pageContext.json` HTTP request, the base URL should be preserved. (The server-side will handle the base URL.)
// - While prerendering there is no base URL
const baseUrl = '/'

/**
 (`/`, `.html`) -> `/index.html`
 (`/`, `.pageContext`) -> `/index.pageContext.json`
 (`/about`, `.html`) -> `/about/index.html`
 (`/about/`, `.pageContext`) -> `/about/index.pageContext.json`
 (`/news/hello`, `.html`) -> `/news/hello/index.html`
 (`/product/42?review=true#reviews`, `.pageContext`) -> `/product/42/index.pageContext?review=true#reviews`
 ...
*/
function getFileUrl(
  url: string,
  fileExtension: '.html' | '.pageContext.json',
  doNotCreateExtraDirectory: boolean,
): string {
  assert(fileExtension !== '.pageContext.json' || doNotCreateExtraDirectory === true)
  const { pathnameWithBaseUrl, searchString, hashString } = parseUrl(url, baseUrl)
  if (url.startsWith('/')) {
    assert(url === `${pathnameWithBaseUrl}${searchString || ''}${hashString || ''}`, { url })
  }

  let pathnameModified = pathnameWithBaseUrl
  if (doNotCreateExtraDirectory) {
    if (pathnameModified.endsWith('/')) {
      pathnameModified = slice(pathnameModified, 0, -1)
    }
    assert(!pathnameModified.endsWith('/'))
    if (pathnameModified === '') {
      pathnameModified = '/index'
    }
  } else {
    const trailingSlash = pathnameWithBaseUrl.endsWith('/') ? '' : '/'
    pathnameModified = pathnameModified + `${trailingSlash}index`
  }

  const fileUrl = `${pathnameModified}${fileExtension}${searchString || ''}${hashString || ''}`
  return fileUrl
}

function handlePageContextRequestSuffix(url: string): {
  urlWithoutPageContextRequestSuffix: string
  isPageContextRequest: boolean
} {
  if (!hasSuffix(url)) {
    return { urlWithoutPageContextRequestSuffix: url, isPageContextRequest: false }
  }
  return { urlWithoutPageContextRequestSuffix: removePageContextUrlSuffix(url), isPageContextRequest: true }
}

function hasSuffix(url: string) {
  const { pathnameWithBaseUrl, pathnameWithoutBaseUrl } = parseUrl(url, baseUrl)
  assert(pathnameWithBaseUrl.endsWith(suffix) === pathnameWithoutBaseUrl.endsWith(suffix), { url })
  return pathnameWithBaseUrl.endsWith(suffix)
}

function removePageContextUrlSuffix(url: string): string {
  const urlParsed = parseUrl(url, baseUrl)
  const { origin, searchString, hashString } = urlParsed
  // We cannot use `urlParsed.pathnameWithoutBaseUrl` because it would break the `urlParsed.pathnameWithBaseUrl` value of subsequent `parseUrl()` calls.
  let pathname = urlParsed.pathnameWithBaseUrl
  assert(pathname.endsWith(suffix))
  assert(url === `${origin || ''}${pathname}${searchString || ''}${hashString || ''}`, { url })
  pathname = slice(pathname, 0, -1 * suffix.length)
  if (pathname === '/index') pathname = '/'
  return `${origin || ''}${pathname}${searchString || ''}${hashString || ''}`
}
