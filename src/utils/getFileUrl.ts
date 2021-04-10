import { assert, slice, parseUrl } from '../utils'
const pagePropsSuffix = '/index.pageProps.json'

export { getFileUrl }
export { isPagePropsUrl }
export { removePagePropsSuffix }

/**
 (`/`, `.html`) -> `/index.html`
 (`/`, `.pageProps`) -> `/index.pageProps.json`
 (`/about`, `.html`) -> `/about/index.html`
 (`/about/`, `.pageProps`) -> `/about/index.pageProps.json`
 (`/news/hello`, `.html`) -> `/news/hello/index.html`
 (`/product/42?review=true#reviews`, `.pageProps`) -> `/product/42/index.pageProps?review=true#reviews`
 ...
*/
function getFileUrl(url: string, fileExtension: '.html' | '.pageProps.json'): string {
  assert(url.startsWith('/'))
  const { pathname, search, hash } = parseUrl(url)
  assert(url === `${pathname}${search}${hash}`)
  const trailingSlash = pathname.endsWith('/') ? '' : '/'
  return `${pathname}${trailingSlash}index${fileExtension}${search}${hash}`
}

function isPagePropsUrl(url: string): boolean {
  const { pathname } = parseUrl(url)
  return pathname.endsWith(pagePropsSuffix)
}
function removePagePropsSuffix(url: string): string {
  assert(isPagePropsUrl(url))
  let { origin, pathname, search, hash } = parseUrl(url)
  assert(url === `${origin}${pathname}${search}${hash}`)
  assert(pathname.endsWith(pagePropsSuffix))
  pathname = slice(pathname, 0, -1 * pagePropsSuffix.length)
  if (pathname === '') pathname = '/'
  return `${origin}${pathname}${search}${hash}`
}
