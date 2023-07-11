import { assert, parseUrl, assertWarning, isPlainObject, hasPropertyGetter } from './utils'

export { addComputedUrlProps }
export { assertURLs }
export type { PageContextUrls }
export type { PageContextUrlSource }

// Copy paste from https://vite-plugin-ssr.com/pageContext
type UrlParsed = {
  /** The URL origin, e.g. `https://example.com` of `https://example.com/product/42?details=yes#reviews` */
  origin: null | string
  /** The URL pathname, e.g. `/product/42` of `https://example.com/product/42?details=yes#reviews` */
  pathname: string
  /** URL pathname including the Base URL, e.g. `/some-base-url/product/42` of `https://example.com/some-base-url/product/42` (whereas `pageContext.urlParsed.pathname` is `/product/42`) */
  pathnameOriginal: string
  /** The URL search parameters, e.g. `{ details: 'yes' }` for `https://example.com/product/42?details=yes#reviews` */
  search: Record<string, string>
  /** The URL search parameters array, e.g. `{ fruit: ['apple', 'orange'] }` for `https://example.com?fruit=apple&fruit=orange` **/
  searchAll: Record<string, string[]>
  /** The URL search parameterer string, e.g. `?details=yes` of `https://example.com/product/42?details=yes#reviews` */
  searchOriginal: null | string
  /** @deprecated */
  searchString: null | string
  /** The URL hash, e.g. `reviews` of `https://example.com/product/42?details=yes#reviews` */
  hash: string
  /** The URL hash string, e.g. `#reviews` of `https://example.com/product/42?details=yes#reviews` */
  hashOriginal: null | string
  /** @deprecated */
  hashString: null | string
}
type PageContextUrls = {
  /** @deprecated */
  url: string
  /** The URL of the HTTP request */
  urlOriginal: string
  /** The URL set by `throw renderUrl(urlRewrite)` */
  urlRewrite: string | null
  /** The URL set by `throw redirect(statusCode, urlRedirect)` */
  urlRedirect: string | null
  /** The URL pathname, e.g. `/product/42` of `https://example.com/product/42?details=yes#reviews` */
  urlPathname: string
  /** Parsed information about the current URL */
  urlParsed: UrlParsed
}

function addComputedUrlProps<PageContext extends Record<string, unknown> & PageContextUrlSource>(
  pageContext: PageContext,
  enumerable = true
): asserts pageContext is PageContext & PageContextUrls {
  assert(pageContext.urlOriginal)

  if ('urlPathname' in pageContext) {
    assert(hasPropertyGetter(pageContext, 'urlPathname'))
  }
  Object.defineProperty(pageContext, 'urlPathname', {
    get: urlPathnameGetter,
    enumerable,
    configurable: true
  })

  // TODO/v1-release: move pageContext.urlParsed to pageContext.url
  if ('url' in pageContext) assert(hasPropertyGetter(pageContext, 'url'))
  Object.defineProperty(pageContext, 'url', {
    get: urlGetter,
    enumerable: false,
    configurable: true
  })

  if ('urlParsed' in pageContext) {
    assert(hasPropertyGetter(pageContext, 'urlParsed'))
  }
  Object.defineProperty(pageContext, 'urlParsed', {
    get: urlParsedGetter,
    enumerable,
    configurable: true
  })
}

type PageContextUrlSource = {
  urlOriginal: string
  urlRewrite?: string | null
  _baseServer: string
  _urlHandler: null | ((url: string) => string)
}
function getUrlParsed(pageContext: PageContextUrlSource) {
  // We use a url handler function because the onBeforeRoute() hook may modify pageContext.urlOriginal (e.g. for i18n)
  let urlHandler = pageContext._urlHandler
  if (!urlHandler) {
    urlHandler = (url: string) => url
  }

  const urlSource = pageContext.urlRewrite ?? pageContext.urlOriginal
  assert(urlSource)
  assert(typeof urlSource === 'string')
  const url = urlHandler(urlSource)

  const baseServer = pageContext._baseServer
  assert(baseServer.startsWith('/'))

  return parseUrl(url, baseServer)
}
function urlPathnameGetter(this: PageContextUrlSource) {
  const { pathname } = getUrlParsed(this)
  const urlPathname = pathname
  assert(urlPathname.startsWith('/'))
  return urlPathname
}
function urlGetter(this: PageContextUrlSource) {
  assertWarning(
    false,
    '`pageContext.url` is outdated. Use `pageContext.urlPathname`, `pageContext.urlParsed`, or `pageContext.urlOriginal` instead. (See https://vite-plugin-ssr.com/migration/0.4.23 for more information.)',
    { onlyOnce: true, showStackTrace: true }
  )
  return urlPathnameGetter.call(this)
}
function urlParsedGetter(this: PageContextUrlSource) {
  const urlParsedOriginal = getUrlParsed(this)
  const { origin, pathname, pathnameOriginal, search, searchAll, searchOriginal, hash, hashOriginal } =
    urlParsedOriginal
  const urlParsed: UrlParsed = {
    origin,
    pathname,
    pathnameOriginal,
    search,
    searchAll,
    searchOriginal,
    hash,
    hashOriginal,
    get hashString() {
      assertWarning(
        false,
        '`pageContext.urlParsed.hashString` has been renamed to `pageContext.urlParsed.hashOriginal`',
        { onlyOnce: true, showStackTrace: true }
      )
      return hashOriginal
    },
    get searchString() {
      assertWarning(
        false,
        '`pageContext.urlParsed.searchString` has been renamed to `pageContext.urlParsed.searchOriginal`',
        { onlyOnce: true, showStackTrace: true }
      )
      return searchOriginal
    }
  }
  makeNonEnumerable(urlParsed, 'hashString')
  makeNonEnumerable(urlParsed, 'searchString')
  return urlParsed
}

function makeNonEnumerable(obj: Object, prop: string) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop)
  Object.defineProperty(obj, prop, { ...descriptor, enumerable: false })
}

function assertURLs(pageContext: { urlOriginal: string } & PageContextUrls) {
  assert(typeof pageContext.urlOriginal === 'string')
  assert(typeof pageContext.urlPathname === 'string')
  assert(isPlainObject(pageContext.urlParsed))
  assert(pageContext.urlPathname === pageContext.urlParsed.pathname)
}
