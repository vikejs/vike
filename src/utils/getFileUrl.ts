import { getUrlParts, getUrlPathname } from './parseUrl'
import { assert } from './assert'
import { slice } from './slice'
const pageContextUrlSuffix = '/index.pageContext.json'

export { getFileUrl }
export { isPageContextUrl }
export { removePageContextUrlSuffix }

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
  doNotCreateExtraDirectory?: true
): string {
  assert(url.startsWith('/'), { url })
  const { pathname, searchString, hashString } = getUrlParts(url)
  assert(url === `${pathname}${searchString}${hashString}`, { url })

  let fileBase: string
  if (doNotCreateExtraDirectory) {
    fileBase = pathname.endsWith('/') ? 'index' : ''
  } else {
    const trailingSlash = pathname.endsWith('/') ? '' : '/'
    fileBase = `${trailingSlash}index`
  }

  return `${pathname}${fileBase}${fileExtension}${searchString}${hashString}`
}

function isPageContextUrl(url: string): boolean {
  const urlPathname = getUrlPathname(url)
  return urlPathname.endsWith(pageContextUrlSuffix)
}
function removePageContextUrlSuffix(url: string): string {
  assert(isPageContextUrl(url), { url })
  let { origin, pathname, searchString, hashString } = getUrlParts(url)
  assert(url === `${origin}${pathname}${searchString}${hashString}`, { url })
  assert(pathname.endsWith(pageContextUrlSuffix), { url })
  pathname = slice(pathname, 0, -1 * pageContextUrlSuffix.length)
  if (pathname === '') pathname = '/'
  return `${origin}${pathname}${searchString}${hashString}`
}
