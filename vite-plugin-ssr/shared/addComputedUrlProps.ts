import { assert, parseUrl, isCallable } from './utils'

export { addComputedUrlProps }
export type { PageContextUrls }
export type { PageContextUrlSource }

// Copy paste from https://vite-plugin-ssr.com/pageContext
type UrlParsed = {
  origin: null | string
  pathname: string
  search: Record<string, string>
  hash: string
  searchOriginal: null | string
  hashOriginal: null | string
}
type PageContextUrls = { urlPathname: string; urlParsed: UrlParsed }

function addComputedUrlProps<PageContext extends Record<string, unknown> & PageContextUrlSource>(
  pageContext: PageContext,
): asserts pageContext is PageContext & PageContextUrls {
  if ('urlPathname' in pageContext) {
    assert(Object.getOwnPropertyDescriptor(pageContext, 'urlPathname')?.get === urlPathnameGetter)
    assert(Object.getOwnPropertyDescriptor(pageContext, 'urlParsed')?.get === urlParsedGetter)
  } else {
    Object.defineProperty(pageContext, 'urlPathname', {
      get: urlPathnameGetter,
      enumerable: true,
      configurable: true,
    })
    Object.defineProperty(pageContext, 'urlParsed', {
      get: urlParsedGetter,
      enumerable: true,
      configurable: true,
    })
  }
}

type PageContextUrlSource = { url: string; _baseUrl: string; _urlProcessor: null | ((url: string) => string) }
function getUrlParsed(pageContext: PageContextUrlSource) {
  let { url, _baseUrl: baseUrl, _urlProcessor: urlProcessor } = pageContext
  assert(baseUrl.startsWith('/'))
  assert(urlProcessor === null || isCallable(urlProcessor))
  if (urlProcessor !== null) {
    url = urlProcessor(url)
  }
  return parseUrl(url, baseUrl)
}
function urlPathnameGetter(this: PageContextUrlSource) {
  const { pathname } = getUrlParsed(this)
  const urlPathname = pathname
  assert(urlPathname.startsWith('/'))
  return urlPathname
}
function urlParsedGetter(this: PageContextUrlSource) {
  const urlParsedOriginal = getUrlParsed(this)
  const { origin, pathname: pathname, search, hash, searchOriginal, hashOriginal } = urlParsedOriginal
  const urlParsed: UrlParsed = { origin, pathname, search, hash, searchOriginal, hashOriginal }
  return urlParsed
}
