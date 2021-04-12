import { assert, slice, parseUrl } from '../utils'
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
  assert(url.startsWith('/'))
  const { pathname, search, hash } = parseUrl(url)
  assert(url === `${pathname}${search}${hash}`)
  const trailingSlash = pathname.endsWith('/') ? '' : '/'
  return `${pathname}${trailingSlash}index${fileExtension}${search}${hash}`
}

function isContextPropsUrl(url: string): boolean {
  const { pathname } = parseUrl(url)
  return pathname.endsWith(contextPropsUrlSuffix)
}
function removeContextPropsUrlSuffix(url: string): string {
  assert(isContextPropsUrl(url))
  let { origin, pathname, search, hash } = parseUrl(url)
  assert(url === `${origin}${pathname}${search}${hash}`)
  assert(pathname.endsWith(contextPropsUrlSuffix))
  pathname = slice(pathname, 0, -1 * contextPropsUrlSuffix.length)
  if (pathname === '') pathname = '/'
  return `${origin}${pathname}${search}${hash}`
}
