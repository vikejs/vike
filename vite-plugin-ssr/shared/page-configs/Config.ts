export type { Config }

import type { PrefetchStaticAssets } from '../../client/router/prefetch/getPrefetchConfig'
import type { ConfigVpsUserProvided } from '../ConfigVps'
// TODO: write docs of links below

import type { ConfigEnv } from './PageConfig'

/** Page configuration.
 *
 * See https://vite-plugin-ssr.com/config
 */
type Config<Page = unknown> = Partial<
  ConfigVpsUserProvided & {
    /** The root UI component of the page */
    Page: Page

    /** The page's route */
    route: string | Function

    /** Hook called before the page is rendered, usually used for fetching data.
     *
     *  See https://vite-plugin-ssr.com/onBeforeRender
     */
    onBeforeRender: Function

    /** Determine what properties of pageContext are sent to the client-side.
     *
     * See https://vite-plugin-ssr.com/passToClient
     */
    passToClient: string[]

    /** Hook called when page is rendered on the client-side.
     *
     * See https://vite-plugin-ssr.com/onRenderClient
     */
    onRenderClient: Function
    /** Hook called when page is rendered to HTML.
     *
     * See https://vite-plugin-ssr.com/onRenderHtml
     */
    onRenderHtml: Function

    /** Enable async Route Functions.
     *
     * See https://vite-plugin-ssr.com/route-function#async
     */
    iKnowThePerformanceRisksOfAsyncRouteFunctions: boolean

    /** Page Hook called when pre-rendering starts.
     *
     * See https://vite-plugin-ssr.com/onPrerenderStart
     */
    onPrerenderStart: Function
    /** Global Hook called before the whole pre-rendering process starts.
     *
     * See https://vite-plugin-ssr.com/onBeforePrerenderStart
     */
    onBeforePrerenderStart: Function

    /** Hook called before the URL is route to a page.
     *
     * See https://vite-plugin-ssr.com/onBeforeRoute
     */
    onBeforeRoute: Function

    /** Hook called after the page is hydrated
     *
     * See https://vite-plugin-ssr.com/clientRouting
     */
    onHydrationEnd: Function
    /** Hook called before the user navigates to a new page.
     *
     * See https://vite-plugin-ssr.com/clientRouting
     */
    onPageTransitionStart: Function
    /** Hook called after the user navigates to a new page.
     *
     * See https://vite-plugin-ssr.com/clientRouting
     */
    onPageTransitionEnd: Function

    /** Whether the page is a page that should be rendered when an error occurs */
    isErrorPage: boolean
    /** Whether your UI framework (React/Vue/Solid/...) allows the page's hydration to be aborted.
     *
     * See https://vite-plugin-ssr.com/clientRouting
     */
    hydrationCanBeAborted: boolean
    /** Additional client entry */
    clientEntry: string
    /** Enable Client Routing.
     *
     * See https://vite-plugin-ssr.com/clientRouting
     */
    clientRouting: boolean

    /** Add or modify config definitions.
     *
     * See https://vite-plugin-ssr/meta
     */
    meta: Meta

    /** Prefetch links.
     *
     * See https://vite-plugin-ssr.com/clientRouting#link-prefetching
     */
    prefetchStaticAssets: PrefetchStaticAssets
  }
>

type Meta = Record<
  string,
  {
    /** Where code is loaded and executed.
     *
     * See https://vite-plugin-ssr/meta
     */
    env: ConfigEnv
    /**
     * Define a so-called "Shortcut Config".
     *
     * See https://vite-plugin-ssr/meta
     */
    effect?: (args: {
      /** Place where the resolved config value comes from.
       *
       * See https://vite-plugin-ssr/meta
       */
      configDefinedAt: string
      /** The resolved config value.
       *
       * See https://vite-plugin-ssr/meta
       */
      configValue: unknown
    }) => Config | undefined
  }
>
