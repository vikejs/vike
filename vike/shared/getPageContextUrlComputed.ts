export { getPageContextUrlComputed }
export { assertPageContextUrl }
export type { PageContextUrlInternal }
export type { PageContextUrlClient }
export type { PageContextUrlServer }
export type { PageContextUrlSource }
// Public type (https://github.com/vikejs/vike/issues/1184)
export type { Url }

// =====================
// File determining the URL logic.
// URLs need to be computed, because the user can modify the URL e.g. with onBeforeRoute() for i18n.
// =====================

import { objectDefineProperty } from '../utils/objectDefineProperty.js'
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
  /** The URL protocol, e.g. `https://` in `https://example.com` */
  protocol: null | string
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

// TODO/v1-release: move pageContext.urlParsed to pageContext.url
type PageContextUrlComputed = {
  /** Parsed information about the current URL */
  urlParsed: Url
  /** The URL pathname, e.g. `/product/42` of `https://example.com/product/42?details=yes#reviews` */
  urlPathname: string
  /** @deprecated */
  url: string
}

type PageContextUrl = {
  /** The URL of the HTTP request */
  urlOriginal: string
} & PageContextUrlComputed
type PageContextUrlInternal = PageContextUrl & {
  _urlRewrite: string | null
}
type PageContextUrlClient = PageContextUrl
type PageContextUrlServer = PageContextUrl & {
  urlParsed: Omit<PageContextUrl['urlParsed'], HashProps> & {
    /** Only available on the client-side */
    hash: ''
    /** Only available on the client-side */
    hashString: null
    /** @deprecated */
    hashOriginal: null
  }
}
type HashProps = 'hash' | 'hashString' | 'hashOriginal'

function getPageContextUrlComputed(pageContext: PageContextUrlSource): PageContextUrlComputed {
  assert(typeof pageContext.urlOriginal === 'string')
  assertPageContextUrlComputed(pageContext)

  const pageContextUrlComputed = {}
  objectDefineProperty(pageContextUrlComputed, 'urlPathname', {
    get: urlPathnameGetter,
    enumerable: true,
    configurable: true
  })
  objectDefineProperty(pageContextUrlComputed, 'url', {
    get: urlGetter,
    enumerable: false,
    configurable: true
  })
  objectDefineProperty(pageContextUrlComputed, 'urlParsed', {
    get: urlParsedGetter,
    enumerable: true,
    configurable: true
  })

  return pageContextUrlComputed
}

type PageContextUrlSource = {
  urlOriginal: string
  urlLogical?: string
  _urlRewrite: string | null
  _baseServer: string
  _urlHandler: null | ((url: string) => string)
}
function getUrlParsed(pageContext: PageContextUrlSource) {
  // Example of i18n app using `throw render()`:
  //  1. User goes to '/fr-FR/admin'.
  //  2. The first onBeforeRoute() call accesses pageContext.urlPathname (its value is '/fr-FR/admin': the pathname of pageContext.urlOriginal, since both pageContext.urlLogical and pageContext._urlRewrite are undefined) and sets pageContext.urlLogical to '/admin'.
  //  3. A guard() hooks accesses pageContext.urlPathname (its value is '/admin': the pathname of pageContext.urlLogical) and calls `throw render('/fr-FR/login')`
  //  4. Vike create a new pageContext object (pageContext.urlLogical is erased) and sets pageContext._urlRewrite to '/fr-FR/login'. (While pageContext.urlOriginal is still '/fr-FR/admin'.)
  //  5. The second onBeforeRoute() call accesses pageContext.urlPathname (its value is '/fr-FR/login': the pathname of pageContext._urlRewrite, since pageContext.urlLogical is undefined) and sets pageContext.urlLogical to '/login'.
  //  6. The value of pageContext.urlPathname is now '/login': the pathname of `pageContext.urlLogical`. (While pageContext.urlOriginal is still '/fr-FR/admin'.)
  // Reproduction: https://github.com/vikejs/vike/discussions/1436#discussioncomment-8142023

  // Determine logical URL
  let urlResolved: string
  let baseToBeRemoved: boolean
  if (pageContext.urlLogical) {
    // Set by onBeforeRoute()
    urlResolved = pageContext.urlLogical
    baseToBeRemoved = false
  } else if (pageContext._urlRewrite) {
    // Set by `throw render()`
    urlResolved = pageContext._urlRewrite
    baseToBeRemoved = false
  } else {
    // Set by renderPage()
    urlResolved = pageContext.urlOriginal
    baseToBeRemoved = true
  }
  assert(urlResolved && typeof urlResolved === 'string')

  // Remove .pageContext.json
  let urlHandler = pageContext._urlHandler
  if (!urlHandler) urlHandler = (url: string) => url
  urlResolved = urlHandler(urlResolved)
  /*
  console.log('pageContext.urlLogical', pageContext.urlLogical)
  console.log('pageContext._urlRewrite', pageContext._urlRewrite)
  console.log('pageContext.urlOriginal', pageContext.urlOriginal)
  console.log()
  //*/

  // Remove Base URL.
  // - We assume there isn't any Base URL to the URLs set by the user at `throw render()` and onBeforeRoute()
  //   - This makes sense because the Base URL is merely a setting: ideally the user should write code that doesn't know anything about it (so that the user can remove/add/change Base URL without having to modify any code).
  // - pageContext.urlOriginal is the URL of the HTTP request and thus contains the Base URL.
  const baseServer = !baseToBeRemoved ? '/' : pageContext._baseServer

  // Parse URL
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
      `pageContext.urlParsed.${prop} isn't available on the server-side (HTTP requests don't include the URL hash)`,
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

function assertPageContextUrl(pageContext: { urlOriginal: string } & PageContextUrlClient) {
  assert(typeof pageContext.urlOriginal === 'string')
  assert(typeof pageContext.urlPathname === 'string')
  assert(isPlainObject(pageContext.urlParsed))
  assert(pageContext.urlPathname === pageContext.urlParsed.pathname)
  assertPageContextUrlComputed(pageContext)
}

function assertPageContextUrlComputed(pageContext: object) {
  /*
  If the isPropertyGetter() assertions fail then it's most likely because Object.assign() was used instead of `objectAssign()`:
  ```js
  const PageContextUrlComputed = getPageContextUrlComputed(pageContext)

  // ❌ Breaks the property descriptors/getters of pageContext defined by getPageContextUrlComputed() such as pageContext.urlPathname
  Object.assign(pageContext, pageContextUrlComputed)

  // ❌ Also breaks property descriptors/getters
  const pageContext = { ...pageContextUrlComputed }

  // ✅ Preserves property descriptors/getters (see objectAssign() implementation)
  objectAssign(pageContext, pageContextUrlComputed)
  ```
  */
  if ('urlPathname' in pageContext) {
    assert(typeof pageContext.urlPathname === 'string')
    assert(isPropertyGetter(pageContext, 'urlPathname'))
    assert(isPropertyGetter(pageContext, 'urlParsed'))
    assert(isPropertyGetter(pageContext, 'url'))
  } else {
    assert(!('urlParsed' in pageContext))
    assert(!('url' in pageContext))
  }
}
