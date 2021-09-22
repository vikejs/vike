import { getUrlParts, getUrlPathname } from './parseUrl'
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
  doNotCreateExtraDirectory: boolean
): string {
  assert(fileExtension !== '.pageContext.json' || doNotCreateExtraDirectory === true)
  assert(url.startsWith('/'), { url })
  const { pathname, searchString, hashString } = getUrlParts(url)
  assert(url === `${pathname}${searchString}${hashString}`, { url })

  let pathnameModified = pathname
  if (doNotCreateExtraDirectory) {
    if (pathnameModified.endsWith('/')) {
      pathnameModified = slice(pathnameModified, 0, -1)
    }
    assert(!pathnameModified.endsWith('/'))
    if (pathnameModified === '') {
      pathnameModified = '/index'
    }
  } else {
    const trailingSlash = pathname.endsWith('/') ? '' : '/'
    pathnameModified = pathnameModified + `${trailingSlash}index`
  }

  return `${pathnameModified}${fileExtension}${searchString}${hashString}`
}

function handlePageContextRequestSuffix(url: string): {
  urlWithoutPageContextRequestSuffix: string
  isPageContextRequest: boolean
} {
  const urlPathname = getUrlPathname(url)
  if (!urlPathname.endsWith(pageContextUrlSuffix)) {
    return { urlWithoutPageContextRequestSuffix: url, isPageContextRequest: false }
  }
  return { urlWithoutPageContextRequestSuffix: removePageContextUrlSuffix(url), isPageContextRequest: true }
}

function removePageContextUrlSuffix(url: string): string {
  let { origin, pathname, searchString, hashString } = getUrlParts(url)
  assert(url === `${origin}${pathname}${searchString}${hashString}`, { url })
  assert(pathname.endsWith(pageContextUrlSuffix), { url })
  pathname = slice(pathname, 0, -1 * pageContextUrlSuffix.length)
  if (pathname === '/index') pathname = '/'
  return `${origin}${pathname}${searchString}${hashString}`
}
