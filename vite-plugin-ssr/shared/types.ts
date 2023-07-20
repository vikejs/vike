export { PageContextBuiltIn }
export { PageContextBuiltInClientWithClientRouting }
export { PageContextBuiltInClientWithServerRouting }

import type { PageContextUrlsPublic } from './addComputedUrlProps'
import type { ConfigEntries, ExportsAll } from './getPageFiles/getExports'
import type { AbortReason } from './route/abort'

/** Built-in `pageContext` properties set by vite-plugin-ssr.
 *
 * https://vite-plugin-ssr.com/pageContext
 */
type PageContextBuiltIn<Page = any> = {
  /** The `export { Page }` of your `.page.js` file.
   *
   * https://vite-plugin-ssr.com/Page
   */
  Page: Page
  /** Route Parameters, e.g. `pageContext.routeParams.productId` for a Route String `/product/@productId`.
   *
   * https://vite-plugin-ssr.com/route-string
   */
  routeParams: Record<string, string>
  /** The page's configuration.
   *
   * https://vite-plugin-ssr.com/config
   */
  config: Record<string, unknown>
  /** The page's configuration, including the configs origin and overriden configs.
   *
   * https://vite-plugin-ssr.com/config
   */
  configEntries: ConfigEntries
  /** Custom Exports/Hooks.
   *
   * https://vite-plugin-ssr.com/exports
   */
  exports: Record<string, unknown>
  /**
   * Same as `pageContext.exports` but cumulative.
   *
   * https://vite-plugin-ssr.com/exports
   */
  exportsAll: ExportsAll
  /** The URL of the current page */
  urlOriginal: string
  /** If an error occurs, whether the error is a `404 Page Not Found`.
   *
   * https://vite-plugin-ssr.com/error-page
   */
  is404: boolean | null
  /**
   * Whether the page was navigated by the client-side router.
   *
   * https://vite-plugin-ssr.com/pageContext
   */
  isClientSideNavigation: boolean

  /**
   * The reason why the original page was aborted. Usually used for showing a custom message on the error page.
   *
   * https://vite-plugin-ssr.com/render
   */
  abortReason?: AbortReason

  /**
   * Error that occured while rendering.
   *
   * https://vite-plugin-ssr.com/errors
   */
  errorWhileRendering?: unknown

  // TODO/v1-release: move pageContext.urlParsed to pageContext.url
  /** @deprecated */
  url: string

  /** @deprecated */
  pageExports: Record<string, unknown>
} & PageContextUrlsPublic

/** Client-side built-in `pageContext` properties set by vite-plugin-ssr (Client Routing).
 *
 * https://vite-plugin-ssr.com/pageContext
 */
type PageContextBuiltInClientWithClientRouting<Page = any> = Partial<PageContextBuiltIn<Page>> &
  Pick<
    PageContextBuiltIn<Page>,
    | 'Page'
    | 'pageExports'
    | 'config'
    | 'configEntries'
    | 'exports'
    | 'exportsAll'
    | 'url'
    | 'urlOriginal'
    | 'urlPathname'
    | 'urlParsed'
    | 'abortReason'
  > & {
    /** Whether the current page is already rendered to HTML */
    isHydration: boolean
    /**
     * Whether the user is navigating back in history.
     *
     * The value is `true` when the user clicks on his browser's backward navigation button, or when invoking `history.back()`.
     */
    isBackwardNavigation: boolean | null
  }

/** Client-side built-in `pageContext` properties set by vite-plugin-ssr (Server Routing).
 *
 * https://vite-plugin-ssr.com/pageContext
 */
type PageContextBuiltInClientWithServerRouting<Page = any> = Partial<PageContextBuiltIn<Page>> &
  Pick<PageContextBuiltIn<Page>, 'Page' | 'pageExports' | 'exports' | 'abortReason'> & {
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
