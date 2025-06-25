export { getPageContextUrlComputed }
export type { PageContextUrlInternal }
export type { PageContextUrlClient }
export type { PageContextUrlServer }
export type { PageContextUrlSource }

// =====================
// File determining the URL logic.
// URLs need to be computed, because the user can modify the URL e.g. with onBeforeRoute() for i18n.
// =====================

import { objectDefineProperty } from '../utils/objectDefineProperty.js'
import { assertPropertyGetters, type PageContextPrepareMinimum } from './preparePageContextForPublicUsage.js'
import { assert, parseUrl, assertWarning, isBrowser, changeEnumerable, type UrlPublic } from './utils.js'

// TO-DO/next-major-release: move pageContext.urlParsed to pageContext.url
type PageContextUrlComputed = {
  /** Parsed information about the current URL */
  urlParsed: UrlPublic
  /** The URL pathname, e.g. `/product/42` of `https://example.com/product/42?details=yes#reviews` */
  urlPathname: string
  /** @deprecated */
  url: string
}

type PageContextUrl = {
  /** The URL of the HTTP request */
  urlOriginal: string
} & PageContextUrlComputed
type PageContextUrlInternal = PageContextPrepareMinimum &
  PageContextUrl & {
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
  assertPropertyGetters(pageContext)

  const pageContextUrlComputed = {}
  objectDefineProperty(pageContextUrlComputed, 'urlPathname', {
    get: urlPathnameGetter,
    enumerable: true,
    configurable: true,
  })
  objectDefineProperty(pageContextUrlComputed, 'url', {
    get: urlGetter,
    enumerable: false,
    configurable: true,
  })
  objectDefineProperty(pageContextUrlComputed, 'urlParsed', {
    get: urlParsedGetter,
    enumerable: true,
    configurable: true,
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
  const assertUrlResolved = (src: number) =>
    assert(
      typeof urlResolved === 'string',
      // TO-DO/eventually: remove debug logs, see:
      // - https://github.com/vikejs/vike/issues/2138#issuecomment-2631713411
      // - https://github.com/vikejs/vike/commit/5c7810f3080ab62536950f26e019bb2a3a517082
      { src, urlResolved },
    )
  let urlResolved: string
  let isBaseToBeRemoved: boolean
  if (pageContext.urlLogical) {
    // Set by onBeforeRoute()
    urlResolved = pageContext.urlLogical
    isBaseToBeRemoved = false
    assertUrlResolved(1)
  } else if (pageContext._urlRewrite) {
    // Set by `throw render()`
    urlResolved = pageContext._urlRewrite
    isBaseToBeRemoved = false
    assertUrlResolved(2)
  } else {
    // Set by renderPage()
    urlResolved = pageContext.urlOriginal
    isBaseToBeRemoved = true
    assertUrlResolved(3)
  }
  assertUrlResolved(4)

  // Remove .pageContext.json
  let urlHandler = pageContext._urlHandler
  if (!urlHandler) urlHandler = (url: string) => url
  urlResolved = urlHandler(urlResolved)

  // Remove Base URL.
  // - We assume there isn't any Base URL to the URLs set by the user at `throw render()` and onBeforeRoute()
  //   - This makes sense because the Base URL is merely a setting: ideally the user should write code that doesn't know anything about it (so that the user can remove/add/change Base URL without having to modify any code).
  // - pageContext.urlOriginal is the URL of the HTTP request and thus contains the Base URL.
  const baseServer = !isBaseToBeRemoved ? '/' : pageContext._baseServer

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
  // TO-DO/next-major-release: remove
  assertWarning(
    false,
    '`pageContext.url` is outdated. Use `pageContext.urlPathname`, `pageContext.urlParsed`, or `pageContext.urlOriginal` instead. (See https://vike.dev/migration/0.4.23 for more information.)',
    { onlyOnce: true, showStackTrace: true },
  )
  return urlPathnameGetter.call(this)
}
function urlParsedGetter(this: PageContextUrlSource) {
  const {
    // remove isBaseMissing as it isn't part of UrlPublic
    isBaseMissing: _,
    ...urlParsed
  } = getUrlParsed(this)

  const hashIsAvailable = isBrowser()
  const warnHashNotAvailable = (prop: HashProps) => {
    assertWarning(
      hashIsAvailable,
      `pageContext.urlParsed.${prop} isn't available on the server-side (HTTP requests don't include the URL hash)`,
      { onlyOnce: true, showStackTrace: true },
    )
  }

  const urlParsedEnhanced: UrlPublic = {
    ...urlParsed,
    get hash() {
      warnHashNotAvailable('hash')
      return urlParsed.hash
    },
    get hashOriginal() {
      warnHashNotAvailable('hashOriginal')
      return urlParsed.hashOriginal
    },
    // TO-DO/next-major-release: remove
    get hashString() {
      assertWarning(false, 'pageContext.urlParsed.hashString has been renamed to pageContext.urlParsed.hashOriginal', {
        onlyOnce: true,
        showStackTrace: true,
      })
      warnHashNotAvailable('hashString')
      return urlParsed.hashOriginal
    },
    // TO-DO/next-major-release: remove
    get searchString() {
      assertWarning(
        false,
        'pageContext.urlParsed.searchString has been renamed to pageContext.urlParsed.searchOriginal',
        { onlyOnce: true, showStackTrace: true },
      )
      return urlParsed.searchOriginal
    },
  }

  changeEnumerable(urlParsedEnhanced, 'hashString', false)
  changeEnumerable(urlParsedEnhanced, 'searchString', false)
  if (!hashIsAvailable) {
    changeEnumerable(urlParsedEnhanced, 'hash', false)
    changeEnumerable(urlParsedEnhanced, 'hashOriginal', false)
  }

  return urlParsedEnhanced
}
