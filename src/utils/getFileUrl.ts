import { getUrlParts, getUrlPathname } from './parseUrl'
import { assert } from './assert'
import { slice } from './slice'
const contextPropsUrlSuffix = '/index.contextProps.json'

export { getFileUrl }
export { isContextPropsUrl }
export { removeContextPropsUrlSuffix }

/**
 (`/`, `.html`) -> `/index.html`
 (`/`, `.contextProps`) -> `/index.contextProps.json`
 (`/about`, `.html`) -> `/about/index.html`
 (`/about/`, `.contextProps`) -> `/about/index.contextProps.json`
 (`/news/hello`, `.html`) -> `/news/hello/index.html`
 (`/product/42?review=true#reviews`, `.contextProps`) -> `/product/42/index.contextProps?review=true#reviews`
 ...
*/
function getFileUrl(url: string, fileExtension: '.html' | '.contextProps.json'): string {
  assert(url.startsWith('/'), { url })
  const { pathname, searchString, hashString } = getUrlParts(url)
  assert(url === `${pathname}${searchString}${hashString}`, { url })
  const trailingSlash = pathname.endsWith('/') ? '' : '/'
  return `${pathname}${trailingSlash}index${fileExtension}${searchString}${hashString}`
}

function isContextPropsUrl(url: string): boolean {
  const urlPathname = getUrlPathname(url)
  return urlPathname.endsWith(contextPropsUrlSuffix)
}
function removeContextPropsUrlSuffix(url: string): string {
  assert(isContextPropsUrl(url), { url })
  let { origin, pathname, searchString, hashString } = getUrlParts(url)
  assert(url === `${origin}${pathname}${searchString}${hashString}`, { url })
  assert(pathname.endsWith(contextPropsUrlSuffix), { url })
  pathname = slice(pathname, 0, -1 * contextPropsUrlSuffix.length)
  if (pathname === '') pathname = '/'
  return `${origin}${pathname}${searchString}${hashString}`
}
