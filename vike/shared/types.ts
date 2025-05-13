// Public usage
export type { PageContext }
export type { PageContextServer }
export type { PageContextClient }
export type { GlobalContext }
export type { GlobalContextServer }
export type { GlobalContextClient }
// For users who don't use Client Routing
//  - PageContextServer is the same for Client Routing and Server Routing
export type { PageContextWithServerRouting }
export type { PageContextClientWithServerRouting }
export type { GlobalContextClientWithServerRouting }

// Internal usage
export type { PageContextInternalServer }
export type { PageContextInternalClient }
export type { PageContextInternalClient_ServerRouting }
export type { PageContextInternalClient_ClientRouting }

// TODO/v1-release: remove these three exports
export type { PageContextBuiltInServer_deprecated as PageContextBuiltInServer }
export type { PageContextBuiltInClientWithClientRouting_deprecated as PageContextBuiltInClientWithClientRouting }
export type { PageContextBuiltInClientWithServerRouting_deprecated as PageContextBuiltInClientWithServerRouting }

import type { PageContextUrlInternal, PageContextUrlClient, PageContextUrlServer } from './getPageContextUrlComputed.js'
import type { ConfigEntries, ExportsAll, From, Source, Sources } from './page-configs/getUserFriendlyConfigs.js'
import type { Config } from './page-configs/Config.js'
import type { PageContextConfig } from './page-configs/Config/PageContextConfig.js'
import type { AbortStatusCode } from './route/abort.js'
import type { GlobalContextServer } from '../node/runtime/globalContext.js'
import type { GlobalContextClient } from '../client/client-routing-runtime/globalContext.js'
import type { GlobalContextClientWithServerRouting } from '../client/server-routing-runtime/globalContext.js'

type PageContextServer<Data = unknown> = PageContextBuiltInServer<Data> & Vike.PageContext & Vike.PageContextServer

// With Client Routing
//  - Because of vike-{react/vue/solid} most users will eventually be using Client Routing => we give out the succint type names `PageContext` and `PageContextClient` to these users
type PageContext<Data = unknown> = PageContextClient<Data> | PageContextServer<Data>
type PageContextClient<Data = unknown> = PageContextBuiltInClientWithClientRouting<Data> &
  Vike.PageContext &
  Vike.PageContextClient

type GlobalContext = GlobalContextServer | GlobalContextClient

// With Server Routing
type PageContextWithServerRouting<Data = unknown> = PageContextClientWithServerRouting<Data> | PageContextServer<Data>
type PageContextClientWithServerRouting<Data = unknown> = PageContextBuiltInClientWithServerRouting<Data> &
  Vike.PageContext &
  Vike.PageContextClient

type PageContextBuiltInCommon<Data> = {
  /**
   * Useful for distinguishing `pageContext` from other objects and narrowing down TypeScript unions.
   *
   * https://vike.dev/pageContext#typescript
   */
  isPageContext: true

  /** The `export { Page }` of your `.page.js` file.
   *
   * https://vike.dev/Page
   * https://vike.dev/pageContext#Page
   */
  Page: Config['Page']
  /** Route Parameters, e.g. `pageContext.routeParams.productId` for a Route String `/product/@productId`.
   *
   * https://vike.dev/route-string
   * https://vike.dev/pageContext#routeParams
   */
  routeParams: Record<string, string>
  /** The page's data which was fetched using the data() hook.
   *
   * https://vike.dev/data
   * https://vike.dev/pageContext#data
   */
  data?: Data
  /** The page's configuration values.
   *
   * https://vike.dev/config
   * https://vike.dev/pageContext#config
   */
  config: PageContextConfig
  /** The page's configuration, including the configs origin and overriden configs.
   *
   * https://vike.dev/config
   */
  configEntries: ConfigEntries
  /** Custom Exports/Hooks.
   *
   * https://vike.dev/exports
   */
  exports: Record<string, unknown>
  /**
   * Same as `pageContext.exports` but cumulative.
   *
   * https://vike.dev/exports
   */
  exportsAll: ExportsAll
  /** The URL you provided to Vike when calling `renderPage({ urlOriginal })` in your server middleware.
   *
   * https://vike.dev/renderPage
   */
  urlOriginal: string
  /**
   * The HTTP Headers of the incoming HTTP Request.
   *
   * As a string object normalized by Vike.
   *
   * https://vike.dev/headers
   * https://vike.dev/pageContext#headers
   */
  headers: Record<string, string> | null
  /**
   * The HTTP Headers of the incoming HTTP Request.
   *
   * The original object provided by the server.
   *
   * https://vike.dev/headers
   * https://vike.dev/pageContext#headersOriginal
   */
  headersOriginal?: unknown
  /** If an error occurs, whether the error is a `404 Page Not Found`.
   *
   * https://vike.dev/error-page
   */
  is404: boolean | null
  /**
   * Whether the page was navigated by the client-side router.
   *
   * https://vike.dev/pageContext#isClientSideNavigation
   */
  isClientSideNavigation: boolean

  /**
   * The reason why the original page was aborted. Usually used for showing a custom message on the error page.
   *
   * https://vike.dev/render
   * https://vike.dev/pageContext#abortReason
   */
  abortReason?: unknown

  /**
   * The status code set by `throw render(abortStatusCode)`.
   *
   * https://vike.dev/render
   * https://vike.dev/pageContext#abortStatusCode
   */
  abortStatusCode?: AbortStatusCode

  /**
   * Error that occured while rendering.
   *
   * https://vike.dev/error-tracking
   * https://vike.dev/pageContext#errorWhileRendering
   */
  errorWhileRendering?: unknown

  /**
   * The page's unique identifier.
   */
  pageId: string | null

  /** @experimental https://github.com/vikejs/vike/issues/1268 */
  from: From
  /** @experimental https://github.com/vikejs/vike/issues/1268 */
  source: Source
  /** @experimental https://github.com/vikejs/vike/issues/1268 */
  sources: Sources

  // TODO/v1-release: move pageContext.urlParsed to pageContext.url
  /** @deprecated */
  url: string

  // TODO/v1-release: remove
  /** @deprecated */
  pageExports: Record<string, unknown>

  /**
   * Whether the Base URL is missing in the URL of the HTTP request made to the SSR server.
   *
   * https://vike.dev/base-url#setup
   * https://vike.dev/pageContext#isBaseMissing
   */
  isBaseMissing?: true
}

type PageContextBuiltInServer<Data> = PageContextBuiltInCommon<Data> &
  PageContextUrlServer & {
    /**
     * Whether the page is being rendered on the client-side or server-side / pre-rendered.
     *
     * We recommend using `import.meta.env.SSR` instead, see https://vike.dev/pageContext#isClientSide
     *
     * https://vike.dev/pageContext#isClientSide
     */
    isClientSide: false
    /**
     * Whether the page is being pre-rendered.
     *
     * The value is always `false` in development.
     *
     * https://vike.dev/pre-rendering
     * https://vike.dev/pageContext#isPrerendering
     */
    isPrerendering: boolean
    /**
     * Runtime information about your app.
     *
     * https://vike.dev/getGlobalContext
     * https://vike.dev/pageContext#globalContext
     */
    globalContext: GlobalContextServer

    isHydration?: undefined
    isBackwardNavigation?: undefined
    previousPageContext?: undefined
  }

type PageContextBuiltInClientWithClientRouting<Data> = Partial<PageContextBuiltInCommon<Data>> &
  Pick<
    PageContextBuiltInCommon<Data>,
    | 'Page'
    | 'routeParams'
    | 'pageExports'
    | 'config'
    | 'configEntries'
    | 'exports'
    | 'exportsAll'
    | 'abortReason'
    | 'data'
    | 'pageId'
    | 'source'
    | 'sources'
    | 'from'
  > &
  PageContextClientCommon & {
    /** Whether the current page is already rendered to HTML */
    isHydration: boolean
    /**
     * Whether the user is navigating back in history.
     *
     * The value is `true` when the user clicks on his browser's backward navigation button, or when invoking `history.back()`.
     *
     * https://vike.dev/pageContext#isBackwardNavigation
     */
    isBackwardNavigation: boolean | null
    /**
     * Upon client-side page navigation, you can use `pageContext.previousPageContext` to access the `pageContext` of the previous page.
     *
     * https://vike.dev/pageContext#previousPageContext
     */
    previousPageContext: PageContextClient<Data> | null
    globalContext: GlobalContextClient
  } & PageContextUrlClient

type PageContextBuiltInClientWithServerRouting<Data> = Partial<PageContextBuiltInCommon<Data>> &
  Pick<PageContextBuiltInCommon<Data>, 'Page' | 'pageExports' | 'exports' | 'abortReason' | 'pageId' | 'data'> &
  PageContextClientCommon & {
    /**
     * Whether the current page is already rendered to HTML.
     *
     * The `isHydration` value is always `true` when using Server Routing.
     *
     * https://vike.dev/pageContext#isHydration
     */
    isHydration: true
    /**
     * Whether the user is navigating back in history.
     *
     * The `isBackwardNavigation` property only works with Client Routing. (The value is always `null` when using Server Routing.)
     *
     * https://vike.dev/pageContext#isBackwardNavigation
     */
    isBackwardNavigation: null
    globalContext: GlobalContextClientWithServerRouting
  }

type PageContextClientCommon = {
  /**
   * Whether the page is being rendered on the client-side, or rendered on the server-side / pre-rendered.
   *
   * In order to save client-side KBs, we recommend using `import.meta.env.SSR` whenever possible instead, see https://vike.dev/pageContext#isClientSide
   *
   * https://vike.dev/pageContext#isClientSide
   */
  isClientSide: true
  /**
   * Whether the page is being pre-rendered.
   *
   * The value is always `false` in development.
   *
   * https://vike.dev/pre-rendering
   * https://vike.dev/pageContext#isPrerendering
   */
  isPrerendering: false
}

type PageContextInternalServer = Omit<
  PageContextBuiltInCommon<unknown> & PageContextUrlInternal,
  'data' | 'globalContext'
>
// The following is only accessible to users over the public ES proxies
type OnlyUsers = 'Page' | 'globalContext'
type PageContextInternalClient = Omit<
  PageContextInternalClient_ClientRouting | PageContextInternalClient_ServerRouting,
  // I don't know why Omit is needed again
  OnlyUsers
>
type PageContextInternalClient_ClientRouting = Omit<
  PageContextBuiltInClientWithClientRouting<unknown>,
  OnlyUsers | 'previousPageContext'
> & {
  previousPageContext: { pageId: string } | null
}
type PageContextInternalClient_ServerRouting = Omit<PageContextBuiltInClientWithServerRouting<unknown>, OnlyUsers>

/** @deprecated
 * Replace:
 *   ```
 *   import type { PageContextBuiltInServer } from 'vike/types'
 *   ```
 * With:
 *   ```
 *   import { PageContextServer } from 'vike/types'
 *   ```
 *
 * See https://vike.dev/pageContext#typescript
 */
type PageContextBuiltInServer_deprecated<Page = never> = PageContextBuiltInServer<unknown>
/** @deprecated
 * Replace:
 *   ```
 *   import type { PageContextBuiltInClientWithClientRouting } from 'vike/types'
 *   ```
 * With:
 *   ```
 *   import { PageContextClient } from 'vike/types'
 *   ```
 *
 * See https://vike.dev/pageContext#typescript
 */
type PageContextBuiltInClientWithClientRouting_deprecated<Page = never> =
  PageContextBuiltInClientWithClientRouting<unknown>
/** @deprecated
 * Replace:
 *   ```
 *   import type { PageContextBuiltInClientWithServerRouting } from 'vike/types'
 *   ```
 * With:
 *   ```
 *   import { PageContextClientWithServerRouting as PageContextClient } from 'vike/types'
 *   ```
 *
 * See https://vike.dev/pageContext#typescript
 */
type PageContextBuiltInClientWithServerRouting_deprecated<Page = never> =
  PageContextBuiltInClientWithServerRouting<unknown>
