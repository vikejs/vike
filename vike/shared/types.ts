export { PageContext }
export { PageContextServer }
export { PageContextClient }

// For users who don't use Client Routing
export { PageContextWithServerRouting }
export { PageContextClientWithServerRouting }

export { PageContextBuiltInServer }
export { PageContextBuiltInServerInternal }
export { PageContextBuiltInClientWithClientRouting }
export { PageContextBuiltInClientWithServerRouting }

import type {
  PageContextUrlComputedPropsInternal,
  PageContextUrlComputedPropsClient,
  PageContextUrlComputedPropsServer
} from './addUrlComputedProps.js'
import type { ConfigEntries, ExportsAll } from './getPageFiles/getExports.js'
import type { Config } from './page-configs/Config.js'
import type { PageContextConfig } from './page-configs/Config/PageContextConfig.js'
import type { AbortStatusCode } from './route/abort.js'

type PageContextServer = PageContextBuiltInServer & Vike.PageContext

// When user uses Client Routing
// Because of vike-{react/vue/solid} most users will be using Client Routing => we give out the succint type names `PageContext` and `PageContextClient` to these users
type PageContext = PageContextClient | PageContextServer
type PageContextClient = PageContextBuiltInClientWithClientRouting & Vike.PageContext

// When user uses Server Routing
type PageContextWithServerRouting = PageContextClientWithServerRouting | PageContextServer
type PageContextClientWithServerRouting = PageContextBuiltInClientWithServerRouting & Vike.PageContext

/** Built-in `pageContext` properties set by vike.
 *
 * https://vike.dev/pageContext
 */
type PageContextBuiltInServer<Page = [never]> = PageContextBuiltInCommon<Page> & PageContextUrlComputedPropsServer

type PageContextBuiltInServerInternal<Page = [never]> = PageContextBuiltInCommon<Page> &
  PageContextUrlComputedPropsInternal

type PageContextBuiltInCommon<
  // TODO/v1-design-release: deprecate PageContextBuilt{Server,Client}<Page> in favor of interface merging
  // `= [never]` instead of `= never` because: https://github.com/microsoft/TypeScript/issues/31751#issuecomment-498526919
  Page = [never]
> = {
  /** The `export { Page }` of your `.page.js` file.
   *
   * https://vike.dev/Page
   */
  Page: Page extends [never] ? Config['Page'] : Page
  /** Route Parameters, e.g. `pageContext.routeParams.productId` for a Route String `/product/@productId`.
   *
   * https://vike.dev/route-string
   */
  routeParams: Record<string, string>
  /** The page's configuration values.
   *
   * https://vike.dev/config
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
  /** The URL your provided to Vike when calling `renderPage({ urlOriginal })` in your server middleware. */
  urlOriginal: string
  /** If an error occurs, whether the error is a `404 Page Not Found`.
   *
   * https://vike.dev/error-page
   */
  is404: boolean | null
  /**
   * Whether the page was navigated by the client-side router.
   *
   * https://vike.dev/pageContext
   */
  isClientSideNavigation: boolean

  /**
   * The reason why the original page was aborted. Usually used for showing a custom message on the error page.
   *
   * https://vike.dev/render
   */
  abortReason?: unknown

  /**
   * The status code set by `throw render(abortStatusCode)`.
   *
   * https://vike.dev/render
   */
  abortStatusCode?: AbortStatusCode

  /**
   * Error that occured while rendering.
   *
   * https://vike.dev/errors
   */
  errorWhileRendering?: unknown

  // TODO/v1-release: move pageContext.urlParsed to pageContext.url
  /** @deprecated */
  url: string

  // TODO/v1-release: remove
  /** @deprecated */
  pageExports: Record<string, unknown>
}

/** Client-side built-in `pageContext` properties set by vike (Client Routing).
 *
 * https://vike.dev/pageContext
 */
type PageContextBuiltInClientWithClientRouting<Page = unknown> = Partial<PageContextBuiltInCommon<Page>> &
  Pick<
    PageContextBuiltInCommon<Page>,
    'Page' | 'pageExports' | 'config' | 'configEntries' | 'exports' | 'exportsAll' | 'abortReason'
  > & {
    /** Whether the current page is already rendered to HTML */
    isHydration: boolean
    /**
     * Whether the user is navigating back in history.
     *
     * The value is `true` when the user clicks on his browser's backward navigation button, or when invoking `history.back()`.
     */
    isBackwardNavigation: boolean | null
  } & PageContextUrlComputedPropsClient

/** Client-side built-in `pageContext` properties set by vike (Server Routing).
 *
 * https://vike.dev/pageContext
 */
type PageContextBuiltInClientWithServerRouting<Page = unknown> = Partial<PageContextBuiltInCommon<Page>> &
  Pick<PageContextBuiltInCommon<Page>, 'Page' | 'pageExports' | 'exports' | 'abortReason'> & {
    /**
     * Whether the current page is already rendered to HTML.
     *
     * The `isHydration` value is always `true` when using Server Routing.
     */
    isHydration: true
    /**
     * Whether the user is navigating back in history.
     *
     * The `isBackwardNavigation` property only works with Client Routing. (The value is always `null` when using Server Routing.)
     */
    isBackwardNavigation: null
  }
