import { assert, getUrlPathname, getUrlParsed, UrlParsed, hasProp } from './utils'

export { addComputedUrlProps }
export type { PageContextUrls }

type PageContextUrls = { urlNormalized: string; urlPathname: string; urlParsed: UrlParsed }

function addComputedUrlProps<
  PageContext extends Record<string, unknown> & { url: string; _getUrlNormalized: (url: string) => string }
>(pageContext: PageContext): asserts pageContext is PageContext & PageContextUrls {
  if ('urlNormalized' in pageContext) {
    assert(Object.getOwnPropertyDescriptor(pageContext, 'urlNormalized')?.get === urlNormalizedGetter)
    assert(Object.getOwnPropertyDescriptor(pageContext, 'urlPathname')?.get === urlPathnameGetter)
    assert(Object.getOwnPropertyDescriptor(pageContext, 'urlParsed')?.get === urlParsedGetter)
  } else {
    Object.defineProperty(pageContext, 'urlNormalized', {
      get: urlNormalizedGetter,
      enumerable: true,
      configurable: true
    })
    Object.defineProperty(pageContext, 'urlPathname', { get: urlPathnameGetter, enumerable: true, configurable: true })
    Object.defineProperty(pageContext, 'urlParsed', { get: urlParsedGetter, enumerable: true, configurable: true })
  }
}
function urlNormalizedGetter(this: { url: string; _getUrlNormalized: (url: string) => string }) {
  assert(hasProp(this, 'url', 'string'))
  const urlNormalized = this._getUrlNormalized(this.url)
  return urlNormalized
}
function urlPathnameGetter(this: { urlNormalized: string }) {
  return getUrlPathname(this.urlNormalized)
}
function urlParsedGetter(this: { urlNormalized: string }) {
  return getUrlParsed(this.urlNormalized)
}
