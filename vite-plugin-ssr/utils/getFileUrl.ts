import { parseUrl } from './parseUrl'
import { assert } from './assert'
import { slice } from './slice'
const pageContextUrlSuffix = '.pageContext.json'

export { getFileUrl }
export { handlePageContextRequestSuffix }

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
  const { pathnameWithoutBaseUrl, searchString, hashString } = parseUrl(url, '/') // is Base URL missing?
  if (url.startsWith('/')) {
    assert(url === `${pathnameWithoutBaseUrl}${searchString || ''}${hashString || ''}`, { url })
  }

  let pathnameModified = pathnameWithoutBaseUrl
  if (doNotCreateExtraDirectory) {
    if (pathnameModified.endsWith('/')) {
      pathnameModified = slice(pathnameModified, 0, -1)
    }
    assert(!pathnameModified.endsWith('/'))
    if (pathnameModified === '') {
      pathnameModified = '/index'
    }
  } else {
    const trailingSlash = pathnameWithoutBaseUrl.endsWith('/') ? '' : '/'
    pathnameModified = pathnameModified + `${trailingSlash}index`
  }

  const fileUrl = `${pathnameModified}${fileExtension}${searchString || ''}${hashString || ''}`
  return fileUrl
}

function handlePageContextRequestSuffix(url: string): {
  urlWithoutPageContextRequestSuffix: string
  isPageContextRequest: boolean
} {
  const pathname = parseUrl(url, '/').pathnameWithoutBaseUrl // is Base URL missing?
  if (!pathname.endsWith(pageContextUrlSuffix)) {
    return { urlWithoutPageContextRequestSuffix: url, isPageContextRequest: false }
  }
  return { urlWithoutPageContextRequestSuffix: removePageContextUrlSuffix(url), isPageContextRequest: true }
}

function removePageContextUrlSuffix(url: string): string {
  const urlParsed = parseUrl(url, '/') // is Base URL missing?
  const { origin, searchString, hashString } = urlParsed
  let pathname = urlParsed.pathnameWithoutBaseUrl
  // TODO:
  //  - Re-ensure the uncommented assert, and this time directly in `parseUrl()`
  //    - (It's already there but post `decodeURI()`)
  //  - Use `decodeURI` only for `urlParsed.search`, not for `urlParsed.searchString`
  //  - Use `decodeURI` at `renderPage()`
  //    - It seems like the browser calls `encodeURI()`, which we should decode ASAP, i.e. at the beginning of `renderPage()`
  //       - E.g. `navigate('/foo?key=あ')`
  // assert(url === `${origin || ''}${pathname}${searchString || ''}${hashString || ''}`, { url })
  assert(pathname.endsWith(pageContextUrlSuffix), { url })
  pathname = slice(pathname, 0, -1 * pageContextUrlSuffix.length)
  if (pathname === '/index') pathname = '/'
  return `${origin || ''}${pathname}${searchString || ''}${hashString || ''}`
}
