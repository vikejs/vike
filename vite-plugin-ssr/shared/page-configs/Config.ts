export type { Config }
export type { ConfigNameBuiltIn }
export type { Meta }
export type { Effect }

import type { PrefetchStaticAssets } from '../../client/router/prefetch/getPrefetchSettings'
import type { ConfigVpsUserProvided } from '../ConfigVps'
// TODO: write docs of links below

import type { ConfigEnv } from './PageConfig'

type ConfigNameBuiltIn =
  | Exclude<keyof Config, keyof ConfigVpsUserProvided | 'onBeforeRoute' | 'onPrerenderStart' | 'meta'>
  | 'prerender'

/** Page configuration.
 *
 * See https://vite-plugin-ssr.com/config
 */
type Config<Page = unknown> = Partial<{
  /** The root UI component of the page */
  Page: Page

  /** The page's route
   *
   *  See https://vite-plugin-ssr.com/route
   */
  route: string | Function

  /**
   * Whether to pre-render the page(s).
   *
   * See https://vite-plugin-ssr.com/pre-rendering
   */
  prerender: boolean

  /**
   * Inherit from other configurations.
   *
   * See https://vite-plugin-ssr.com/extends
   */
  extends: Config[]

  /** Hook called before the page is rendered, usually for fetching data.
   *
   *  See https://vite-plugin-ssr.com/onBeforeRender
   */
  onBeforeRender: Function

  /** Determine what pageContext properties are sent to the client-side.
   *
   * See https://vite-plugin-ssr.com/passToClient
   */
  passToClient: string[]

  /** Hook called when page is rendered on the client-side.
   *
   * See https://vite-plugin-ssr.com/onRenderClient
   */
  onRenderClient: Function
  /** Hook called when page is rendered to HTML on the server-side.
   *
   * See https://vite-plugin-ssr.com/onRenderHtml
   */
  onRenderHtml: Function

  /** Enable async Route Functions.
   *
   * See https://vite-plugin-ssr.com/route-function#async
   */
  iKnowThePerformanceRisksOfAsyncRouteFunctions: boolean

  /** Change the URL root of Filesystem Routing.
   *
   * See https://vite-plugin-ssr.com/filesystemRoutingRoot
   */
  filesystemRoutingRoot: boolean

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

  /** Whether your UI framework (React/Vue/Solid/...) allows the page's hydration to be aborted.
   *
   * See https://vite-plugin-ssr.com/clientRouting
   */
  hydrationCanBeAborted: boolean
  /** Additional client code
   *
   * See https://vite-plugin-ssr.com/client
   */
  client: string
  /** Enable Client Routing.
   *
   * See https://vite-plugin-ssr.com/clientRouting
   */
  clientRouting: boolean

  /** Create new or modify existing configurations.
   *
   * See https://vite-plugin-ssr.com/meta
   */
  meta: Meta

  /** Prefetch links.
   *
   * See https://vite-plugin-ssr.com/clientRouting#link-prefetching
   */
  prefetchStaticAssets: PrefetchStaticAssets
}>

type Effect = (args: {
  /** Place where the resolved config value comes from.
   *
   * See https://vite-plugin-ssr.com/meta
   */
  configDefinedAt: string
  /** The resolved config value.
   *
   * See https://vite-plugin-ssr.com/meta
   */
  configValue: unknown
}) => Config | undefined

type Meta = Record<
  string,
  {
    /** In what environment(s) the config value is loaded.
     *
     * See https://vite-plugin-ssr.com/meta
     */
    env: ConfigEnv
    /**
     * Define a so-called "Shortcut Config".
     *
     * See https://vite-plugin-ssr.com/meta
     */
    effect?: Effect
  }
>
