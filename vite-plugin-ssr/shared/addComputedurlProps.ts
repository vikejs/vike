import { assert, getUrlPathname, getUrlParsed, UrlParsed, hasProp } from './utils'

export { addComputedUrlProps }
export type { PageContextUrls }
export type { GetUrlNormalized }

type GetUrlNormalized = (pageContext: { url: string; _baseUrl: string }) => string
type PageContextUrls = { urlPathname: string; urlParsed: UrlParsed }

function addComputedUrlProps<
  PageContext extends Record<string, unknown> & {
    url: string
    _baseUrl: string
    _getUrlNormalized: GetUrlNormalized
  },
>(pageContext: PageContext): asserts pageContext is PageContext & PageContextUrls {
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

type PageContextUrlNormalized = { url: string; _baseUrl: string; _getUrlNormalized: GetUrlNormalized }
function getUrlNormalized(that: PageContextUrlNormalized) {
  assert(hasProp(that, 'url', 'string'))
  const urlNormalized = that._getUrlNormalized(that)
  return urlNormalized
}
function urlPathnameGetter(this: PageContextUrlNormalized) {
  const urlNormalized = getUrlNormalized(this)
  return getUrlPathname(urlNormalized)
}
function urlParsedGetter(this: PageContextUrlNormalized) {
  const urlNormalized = getUrlNormalized(this)
  return getUrlParsed(urlNormalized)
}
