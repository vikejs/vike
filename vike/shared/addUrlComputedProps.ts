// URLs props need to be computed props, because the user can modify the URL e.g. with onBeforeRoute() for i18n

export { addUrlComputedProps }
export { assertPageContextUrlComputedProps }
export type { PageContextUrlComputedPropsInternal }
export type { PageContextUrlComputedPropsClient }
export type { PageContextUrlComputedPropsServer }
export type { PageContextUrlSources }
export type { Url }

import { assert, parseUrl, assertWarning, isPlainObject, isPropertyGetter, isBrowser } from './utils.js'

// Copy paste from https://vike.dev/pageContext
type Url = {
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

type PageContextUrlComputedPropsClient = {
  /** @deprecated */
  url: string
  /** The URL of the HTTP request */
  urlOriginal: string
  /** The URL pathname, e.g. `/product/42` of `https://example.com/product/42?details=yes#reviews` */
  urlPathname: string
  /** Parsed information about the current URL */
  urlParsed: Url
}
/** For Vike internal use */
type PageContextUrlComputedPropsInternal = PageContextUrlComputedPropsClient & {
  _urlRewrite: string | null
}
type HashProps = 'hash' | 'hashString' | 'hashOriginal'
type PageContextUrlComputedPropsServer = PageContextUrlComputedPropsClient & {
  urlParsed: Omit<PageContextUrlComputedPropsClient['urlParsed'], HashProps> & {
    /** Only available on the client-side */
    hash: ''
    /** Only available on the client-side */
    hashString: null
    /** @deprecated */
    hashOriginal: null
  }
}

function addUrlComputedProps<PageContext extends Record<string, unknown> & PageContextUrlSources>(
  pageContext: PageContext,
  enumerable = true
): asserts pageContext is PageContext & PageContextUrlComputedPropsInternal {
  assert(pageContext.urlOriginal)

  if ('urlPathname' in pageContext) {
    assert(typeof pageContext.urlPathname === 'string')
    /* If this assert() fails then it's most likely because Object.assign() was used instead of objectAssign(), i.e.:
       ```js
       // Add property getters such as pageContext.urlPathname to pageContext
       addUrlComputedProps(pageContext)
       // ❌ Breaks the property getters of pageContext set by addUrlComputedProps() such as pageContext.urlPathname
       Object.assign(pageContext2, pageContext)
       // ❌ Also breaks the property getters
       const pageContext3 = { ...pageContext }
       // ✅ Preserves property getters of pageContext (see objectAssign() implementation)
       objectAssign(pageContext2, pageContext)
       ```
    */
    assert(isPropertyGetter(pageContext, 'urlPathname'))
  }
  if ('urlParsed' in pageContext) assert(isPropertyGetter(pageContext, 'urlParsed'))
  // TODO/v1-release: move pageContext.urlParsed to pageContext.url
  if ('url' in pageContext) assert(isPropertyGetter(pageContext, 'url'))

  Object.defineProperty(pageContext, 'urlPathname', {
    get: urlPathnameGetter,
    enumerable,
    configurable: true
  })
  Object.defineProperty(pageContext, 'url', {
    get: urlGetter,
    enumerable: false,
    configurable: true
  })
  Object.defineProperty(pageContext, 'urlParsed', {
    get: urlParsedGetter,
    enumerable,
    configurable: true
  })
}

type PageContextUrlSources = {
  urlOriginal: string
  urlLogical?: string
  _urlRewrite: string | null
  _baseServer: string
  _urlHandler: null | ((url: string) => string)
}
function getUrlParsed(pageContext: PageContextUrlSources) {
  // We need a url handler function because the onBeforeRoute() hook may set pageContext.urlLogical (typically for i18n)
  let urlHandler = pageContext._urlHandler
  if (!urlHandler) {
    urlHandler = (url: string) => url
  }

  let urlResolved = pageContext._urlRewrite ?? pageContext.urlLogical ?? pageContext.urlOriginal
  urlResolved = urlHandler(urlResolved)

  const baseServer = pageContext._baseServer

  assert(urlResolved && typeof urlResolved === 'string')
  assert(baseServer.startsWith('/'))
  return parseUrl(urlResolved, baseServer)
}
function urlPathnameGetter(this: PageContextUrlSources) {
  const { pathname } = getUrlParsed(this)
  const urlPathname = pathname
  assert(urlPathname.startsWith('/'))
  return urlPathname
}
function urlGetter(this: PageContextUrlSources) {
  // TODO/v1-release: remove
  assertWarning(
    false,
    '`pageContext.url` is outdated. Use `pageContext.urlPathname`, `pageContext.urlParsed`, or `pageContext.urlOriginal` instead. (See https://vike.dev/migration/0.4.23 for more information.)',
    { onlyOnce: true, showStackTrace: true }
  )
  return urlPathnameGetter.call(this)
}
function urlParsedGetter(this: PageContextUrlSources) {
  const urlParsedOriginal = getUrlParsed(this)
  const { origin, pathname, pathnameOriginal, search, searchAll, searchOriginal, hash, hashOriginal } =
    urlParsedOriginal

  const hashIsAvailable = isBrowser()
  const warnHashNotAvailable = (prop: HashProps) => {
    assertWarning(
      hashIsAvailable,
      `pageContext.urlParsed.${prop} isn't available on the server-side (HTTP requests don't include the URL hash by design)`,
      { onlyOnce: true, showStackTrace: true }
    )
  }

  const urlParsed: Url = {
    origin,
    pathname,
    pathnameOriginal,
    search,
    searchAll,
    searchOriginal,
    get hash() {
      warnHashNotAvailable('hash')
      return hash
    },
    get hashOriginal() {
      warnHashNotAvailable('hashOriginal')
      return hashOriginal
    },
    get hashString() {
      assertWarning(false, 'pageContext.urlParsed.hashString has been renamed to pageContext.urlParsed.hashOriginal', {
        onlyOnce: true,
        showStackTrace: true
      })
      warnHashNotAvailable('hashString')
      return hashOriginal
    },
    get searchString() {
      assertWarning(
        false,
        'pageContext.urlParsed.searchString has been renamed to pageContext.urlParsed.searchOriginal',
        { onlyOnce: true, showStackTrace: true }
      )
      return searchOriginal
    }
  }

  makeNonEnumerable(urlParsed, 'hashString')
  makeNonEnumerable(urlParsed, 'searchString')
  if (!hashIsAvailable) {
    makeNonEnumerable(urlParsed, 'hash')
    makeNonEnumerable(urlParsed, 'hashOriginal')
  }

  return urlParsed
}

function makeNonEnumerable(obj: Object, prop: string) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop)
  Object.defineProperty(obj, prop, { ...descriptor, enumerable: false })
}

function assertPageContextUrlComputedProps(pageContext: { urlOriginal: string } & PageContextUrlComputedPropsClient) {
  assert(typeof pageContext.urlOriginal === 'string')
  assert(typeof pageContext.urlPathname === 'string')
  assert(isPlainObject(pageContext.urlParsed))
  assert(pageContext.urlPathname === pageContext.urlParsed.pathname)
}
