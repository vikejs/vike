// URLs props need to be computed props, because the user can modify the URL e.g. with onBeforeRoute() for i18n

export { addUrlComputedProps }
export { assertPageContextUrlComputedProps }
export type { PageContextUrlComputedPropsInternal }
export type { PageContextUrlComputedPropsClient }
export type { PageContextUrlComputedPropsServer }
export type { PageContextUrlSource }
export type { Url }

import {
  assert,
  parseUrl,
  assertWarning,
  isPlainObject,
  isPropertyGetter,
  isBrowser,
  changeEnumerable
} from './utils.js'

// JSDocs copied from https://vike.dev/pageContext
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
  /** The URL hash, e.g. `reviews` of `https://example.com/product/42?details=yes#reviews` */
  hash: string
  /** The URL hash string, e.g. `#reviews` of `https://example.com/product/42?details=yes#reviews` */
  hashOriginal: null | string

  // TODO/v1-release: remove
  /** @deprecated */
  hashString: null | string
  /** @deprecated */
  searchString: null | string
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

function addUrlComputedProps<PageContext extends Record<string, unknown> & PageContextUrlSource>(
  pageContext: PageContext
): asserts pageContext is PageContext & PageContextUrlComputedPropsInternal {
  assert(pageContext.urlOriginal)

  if ('urlPathname' in pageContext) {
    assert(typeof pageContext.urlPathname === 'string')
    /* If the following assert() fails then it's most likely because Object.assign() was used instead of objectAssign(), i.e.:
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
    enumerable: true,
    configurable: true
  })
  Object.defineProperty(pageContext, 'url', {
    get: urlGetter,
    enumerable: false,
    configurable: true
  })
  Object.defineProperty(pageContext, 'urlParsed', {
    get: urlParsedGetter,
    enumerable: true,
    configurable: true
  })
}

type PageContextUrlSource = {
  urlOriginal: string
  urlLogical?: string
  _urlRewrite: string | null
  _baseServer: string
  _urlHandler: null | ((url: string) => string)
}
function getUrlParsed(pageContext: PageContextUrlSource) {
  // We need a url handler function because the onBeforeRoute() hook may set pageContext.urlLogical (typically for i18n)
  let urlHandler = pageContext._urlHandler
  if (!urlHandler) {
    urlHandler = (url: string) => url
  }

  // Example of i18n app using `throw render()`:
  //  1. User goes to '/fr-FR/admin'.
  //  2. The first onBeforeRoute() call accesses pageContext.urlPathname (its value is '/fr-FR/admin': the pathname of pageContext.urlOriginal, since both pageContext.urlLogical and pageContext._urlRewrite are undefined) and sets pageContext.urlLogical to '/admin'.
  //  3. A guard() hooks accesses pageContext.urlPathname (its value is '/admin': the pathname of pageContext.urlLogical) and calls `throw render('/fr-FR/login')`
  //  4. Vike create a new pageContext object (pageContext.urlLogical is erased) and sets pageContext._urlRewrite to '/fr-FR/login'. (While pageContext.urlOriginal is still '/fr-FR/admin'.)
  //  5. The second onBeforeRoute() call accesses pageContext.urlPathname (its value is '/fr-FR/login': the pathname of pageContext._urlRewrite, since pageContext.urlLogical is undefined) and sets pageContext.urlLogical to '/login'.
  //  6. The value of pageContext.urlPathname is now '/login': the pathname of `pageContext.urlLogical`. (While pageContext.urlOriginal is still '/fr-FR/admin'.)
  // Reproduction: https://github.com/vikejs/vike/discussions/1436#discussioncomment-8142023
  let urlResolved =
    // Set by onBeforeRoute()
    pageContext.urlLogical ??
    // Set by `throw render()`
    pageContext._urlRewrite ??
    // Set by renderPage()
    pageContext.urlOriginal
  urlResolved = urlHandler(urlResolved)
  /*
  console.log('pageContext.urlLogical', pageContext.urlLogical)
  console.log('pageContext._urlRewrite', pageContext._urlRewrite)
  console.log('pageContext.urlOriginal', pageContext.urlOriginal)
  console.log()
  //*/

  const baseServer = pageContext._baseServer

  assert(urlResolved && typeof urlResolved === 'string')
  assert(baseServer.startsWith('/'))
  return parseUrl(urlResolved, baseServer)
}
function urlPathnameGetter(this: PageContextUrlSource) {
  const { pathname } = getUrlParsed(this)
  const urlPathname = pathname
  assert(urlPathname.startsWith('/'))
  return urlPathname
}
function urlGetter(this: PageContextUrlSource) {
  // TODO/v1-release: remove
  assertWarning(
    false,
    '`pageContext.url` is outdated. Use `pageContext.urlPathname`, `pageContext.urlParsed`, or `pageContext.urlOriginal` instead. (See https://vike.dev/migration/0.4.23 for more information.)',
    { onlyOnce: true, showStackTrace: true }
  )
  return urlPathnameGetter.call(this)
}
function urlParsedGetter(this: PageContextUrlSource) {
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

  changeEnumerable(urlParsed, 'hashString', false)
  changeEnumerable(urlParsed, 'searchString', false)
  if (!hashIsAvailable) {
    changeEnumerable(urlParsed, 'hash', false)
    changeEnumerable(urlParsed, 'hashOriginal', false)
  }

  return urlParsed
}

function assertPageContextUrlComputedProps(pageContext: { urlOriginal: string } & PageContextUrlComputedPropsClient) {
  assert(typeof pageContext.urlOriginal === 'string')
  assert(typeof pageContext.urlPathname === 'string')
  assert(isPlainObject(pageContext.urlParsed))
  assert(pageContext.urlPathname === pageContext.urlParsed.pathname)
}
