export type { Config }
export type { ConfigNameBuiltIn }
export type { ConfigNamePrivate }
export type { Meta }
export type { Effect }

import type { PrefetchStaticAssets } from '../../client/client-routing-runtime/prefetch/getPrefetchSettings.js'
import type { ConfigVpsUserProvided } from '../ConfigVps.js'
// TODO: write docs of links below

import type { ConfigEnvPublic } from './PageConfig.js'

type ConfigNameBuiltIn =
  | Exclude<keyof Config, keyof ConfigVpsUserProvided | 'onBeforeRoute' | 'onPrerenderStart'>
  | 'prerender'

type ConfigNamePrivate = 'isClientSideRenderable' | 'onBeforeRenderEnv'

/** Page configuration.
 *
 * https://vite-plugin-ssr.com/config
 */
type Config<Page = unknown> = Partial<{
  /** The root UI component of the page */
  Page: Page | ImportString

  /** The page's URL(s).
   *
   *  https://vite-plugin-ssr.com/route
   */
  route: string | Function | ImportString

  /** Protect page(s), e.g. forbid unauthorized access.
   *
   *  https://vite-plugin-ssr.com/guard
   */
  guard: Function | ImportString
  /**
   * Whether to pre-render the page(s).
   *
   * https://vite-plugin-ssr.com/pre-rendering
   */
  prerender: boolean | ImportString

  /**
   * Inherit from other configurations.
   *
   * https://vite-plugin-ssr.com/extends
   */
  extends: Config | Config[] | ImportString | ImportString[]

  /** Hook called before the page is rendered, usually for fetching data.
   *
   *  https://vite-plugin-ssr.com/onBeforeRender
   */
  onBeforeRender: Function | ImportString

  /** Determines what pageContext properties are sent to the client-side.
   *
   * https://vite-plugin-ssr.com/passToClient
   */
  passToClient: string[] | ImportString

  /** Hook called when page is rendered on the client-side.
   *
   * https://vite-plugin-ssr.com/onRenderClient
   */
  onRenderClient: Function | ImportString
  /** Hook called when page is rendered to HTML on the server-side.
   *
   * https://vite-plugin-ssr.com/onRenderHtml
   */
  onRenderHtml: Function | ImportString

  /** Enable async Route Functions.
   *
   * https://vite-plugin-ssr.com/route-function#async
   */
  iKnowThePerformanceRisksOfAsyncRouteFunctions: boolean | ImportString

  /** Change the URL root of Filesystem Routing.
   *
   * https://vite-plugin-ssr.com/filesystemRoutingRoot
   */
  filesystemRoutingRoot: string | ImportString

  /** Page Hook called when pre-rendering starts.
   *
   * https://vite-plugin-ssr.com/onPrerenderStart
   */
  onPrerenderStart: Function | ImportString
  /** Global Hook called before the whole pre-rendering process starts.
   *
   * https://vite-plugin-ssr.com/onBeforePrerenderStart
   */
  onBeforePrerenderStart: Function | ImportString

  /** Hook called before the URL is routed to a page.
   *
   * https://vite-plugin-ssr.com/onBeforeRoute
   */
  onBeforeRoute: Function | ImportString

  /** Hook called after the page is hydrated.
   *
   * https://vite-plugin-ssr.com/clientRouting
   */
  onHydrationEnd: Function | ImportString
  /** Hook called before the user navigates to a new page.
   *
   * https://vite-plugin-ssr.com/clientRouting
   */
  onPageTransitionStart: Function | ImportString
  /** Hook called after the user navigates to a new page.
   *
   * https://vite-plugin-ssr.com/clientRouting
   */
  onPageTransitionEnd: Function | ImportString

  /** Whether the UI framework (React/Vue/Solid/...) allows the page's hydration to be aborted.
   *
   * https://vite-plugin-ssr.com/clientRouting
   */
  hydrationCanBeAborted: boolean | ImportString
  /** Additional client code.
   *
   * https://vite-plugin-ssr.com/client
   */
  client: string | ImportString
  /** Enable Client Routing.
   *
   * https://vite-plugin-ssr.com/clientRouting
   */
  clientRouting: boolean | ImportString

  /** Create new or modify existing configurations.
   *
   * https://vite-plugin-ssr.com/meta
   */
  meta: Meta | ImportString

  /** Prefetch links.
   *
   * https://vite-plugin-ssr.com/clientRouting#link-prefetching
   */
  prefetchStaticAssets: PrefetchStaticAssets | ImportString
}>

type Effect = (args: {
  /** Place where the resolved config value comes from.
   *
   * https://vite-plugin-ssr.com/meta
   */
  configDefinedAt: string
  /** The resolved config value.
   *
   * https://vite-plugin-ssr.com/meta
   */
  configValue: unknown
}) => Config | undefined

type Meta = Record<
  string,
  {
    /** In what environment(s) the config value is loaded.
     *
     * https://vite-plugin-ssr.com/meta
     */
    env: ConfigEnvPublic
    /**
     * Define a so-called "Shortcut Config".
     *
     * https://vite-plugin-ssr.com/meta
     */
    effect?: Effect
  }
>

type ImportString = `import:${string}`
