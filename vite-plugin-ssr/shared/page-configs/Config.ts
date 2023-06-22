export type { Config }
export type { ConfigNameBuiltIn }
export type { Meta }
export type { Effect }

import type { PrefetchStaticAssets } from '../../client/router/prefetch/getPrefetchSettings'
import type { ConfigVpsUserProvided } from '../ConfigVps'
// TODO: write docs of links below

import type { ConfigEnvPublic } from './PageConfig'

type ConfigNameBuiltIn =
  | Exclude<keyof Config, keyof ConfigVpsUserProvided | 'onBeforeRoute' | 'onPrerenderStart'>
  | 'prerender'

/** Page configuration.
 *
 * See https://vite-plugin-ssr.com/config
 */
type Config<Page = unknown> = Partial<{
  /** The root UI component of the page */
  Page: Page | ImportString

  /** The page's URL(s).
   *
   *  See https://vite-plugin-ssr.com/route
   */
  route: string | Function | ImportString

  /** Protect page(s), e.g. forbid unauthorized access.
   *
   *  See https://vite-plugin-ssr.com/guard
   */
  guard: Function | ImportString
  /**
   * Whether to pre-render the page(s).
   *
   * See https://vite-plugin-ssr.com/pre-rendering
   */
  prerender: boolean | ImportString

  /**
   * Inherit from other configurations.
   *
   * See https://vite-plugin-ssr.com/extends
   */
  extends: Config | Config[] | ImportString | ImportString[]

  /** Hook called before the page is rendered, usually for fetching data.
   *
   *  See https://vite-plugin-ssr.com/onBeforeRender
   */
  onBeforeRender: Function | ImportString

  /** Determines what pageContext properties are sent to the client-side.
   *
   * See https://vite-plugin-ssr.com/passToClient
   */
  passToClient: string[] | ImportString

  /** Hook called when page is rendered on the client-side.
   *
   * See https://vite-plugin-ssr.com/onRenderClient
   */
  onRenderClient: Function | ImportString
  /** Hook called when page is rendered to HTML on the server-side.
   *
   * See https://vite-plugin-ssr.com/onRenderHtml
   */
  onRenderHtml: Function | ImportString

  /** Enable async Route Functions.
   *
   * See https://vite-plugin-ssr.com/route-function#async
   */
  iKnowThePerformanceRisksOfAsyncRouteFunctions: boolean | ImportString

  /** Change the URL root of Filesystem Routing.
   *
   * See https://vite-plugin-ssr.com/filesystemRoutingRoot
   */
  filesystemRoutingRoot: string | ImportString

  /** Page Hook called when pre-rendering starts.
   *
   * See https://vite-plugin-ssr.com/onPrerenderStart
   */
  onPrerenderStart: Function | ImportString
  /** Global Hook called before the whole pre-rendering process starts.
   *
   * See https://vite-plugin-ssr.com/onBeforePrerenderStart
   */
  onBeforePrerenderStart: Function | ImportString

  /** Hook called before the URL is routed to a page.
   *
   * See https://vite-plugin-ssr.com/onBeforeRoute
   */
  onBeforeRoute: Function | ImportString

  /** Hook called after the page is hydrated
   *
   * See https://vite-plugin-ssr.com/clientRouting
   */
  onHydrationEnd: Function | ImportString
  /** Hook called before the user navigates to a new page.
   *
   * See https://vite-plugin-ssr.com/clientRouting
   */
  onPageTransitionStart: Function | ImportString
  /** Hook called after the user navigates to a new page.
   *
   * See https://vite-plugin-ssr.com/clientRouting
   */
  onPageTransitionEnd: Function | ImportString

  /** Whether the UI framework (React/Vue/Solid/...) allows the page's hydration to be aborted.
   *
   * See https://vite-plugin-ssr.com/clientRouting
   */
  hydrationCanBeAborted: boolean | ImportString
  /** Additional client code
   *
   * See https://vite-plugin-ssr.com/client
   */
  client: string | ImportString
  /** Enable Client Routing.
   *
   * See https://vite-plugin-ssr.com/clientRouting
   */
  clientRouting: boolean | ImportString

  /** Create new or modify existing configurations.
   *
   * See https://vite-plugin-ssr.com/meta
   */
  meta: Meta | ImportString

  /** Prefetch links.
   *
   * See https://vite-plugin-ssr.com/clientRouting#link-prefetching
   */
  prefetchStaticAssets: PrefetchStaticAssets | ImportString
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
    env: ConfigEnvPublic
    /**
     * Define a so-called "Shortcut Config".
     *
     * See https://vite-plugin-ssr.com/meta
     */
    effect?: Effect
  }
>

type ImportString = `import:${string}`
