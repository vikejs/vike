import { assert, slice, parseUrl } from '../utils'
const pagePropsSuffix = '/index.pageProps.json'

export { getFileUrl }
export { isPagePropsUrl }
export { retrieveOriginalUrl }

/**
 (`/`, `.html`) -> `/index.html`
 (`/`, `.pageProps`) -> `/index.pageProps.json`
 (`/about`, `.html`) -> `/about/index.html`
 (`/about/`, `.pageProps`) -> `/about/index.pageProps.json`
 (`/news/hello`, `.html`) -> `/news/hello/index.html`
 (`/product/42?review=true#reviews`, `.pageProps`) -> `/product/42/index.pageProps?review=true#reviews`
 ...
*/
function getFileUrl(
  url: string,
  fileExtension: '.html' | '.pageProps.json'
): string {
  assert(url.startsWith('/'))
  const { pathname, search, hash } = parseUrl(url)
  assert(url === `${pathname}${search}${hash}`)
  const trailingHash = pathname.endsWith('/') ? '' : '/'
  return `${pathname}${trailingHash}index${fileExtension}${search}${hash}`
}

function isPagePropsUrl(url: string): boolean {
  const { pathname } = parseUrl(url)
  return pathname.endsWith(pagePropsSuffix)
}
function retrieveOriginalUrl(url: string): string {
  assert(isPagePropsUrl(url))
  let { pathname, search, hash } = parseUrl(url)
  assert(url === `${pathname}${search}${hash}`)
  pathname = slice(pathname, 0, -1 * pagePropsSuffix.length)
  if (pathname === '') pathname = '/'
  return `${pathname}${search}${hash}`
}
