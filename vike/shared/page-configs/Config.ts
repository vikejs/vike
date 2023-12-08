export type { Config }
export type { ConfigBuiltIn }
export type { ConfigNameBuiltIn }
export type { ConfigMeta }
export type { HookName }
export type { HookNamePage }
export type { HookNameGlobal }

export type { DataAsync }
export type { DataSync }
export type { GuardAsync }
export type { GuardSync }
export type { OnBeforePrerenderStartAsync }
export type { OnBeforePrerenderStartSync }
export type { OnBeforeRenderAsync }
export type { OnBeforeRenderSync }
export type { OnBeforeRouteAsync }
export type { OnBeforeRouteSync }
export type { OnHydrationEndAsync }
export type { OnHydrationEndSync }
export type { OnPageTransitionEndAsync }
export type { OnPageTransitionEndSync }
export type { OnPageTransitionStartAsync }
export type { OnPageTransitionStartSync }
export type { OnPrerenderStartAsync }
export type { OnPrerenderStartSync }
export type { OnRenderClientAsync }
export type { OnRenderClientSync }
export type { OnRenderHtmlAsync }
export type { OnRenderHtmlSync }
export type { RouteAsync }
export type { RouteSync }

import type { PrefetchStaticAssets } from '../../client/client-routing-runtime/prefetch/getPrefetchSettings.js'
import type { ConfigDefinition } from '../../node/plugin/plugins/importUserCode/v1-design/getVikeConfig/configDefinitionsBuiltIn.js'
import type { DocumentHtml } from '../../node/runtime/html/renderHtml.js'
import type { ConfigVikeUserProvided } from '../ConfigVike.js'
import type { Vike, VikePackages } from '../VikeNamespace.js'
import type { HooksTimeoutProvidedByUser } from '../hooks/getHook.js'
import type { PageContextClient, PageContextServer } from '../types.js'

type HookName = HookNamePage | HookNameGlobal | HookNameOldDesign
type HookNamePage =
  | 'onHydrationEnd'
  | 'onBeforePrerenderStart'
  | 'onBeforeRender'
  | 'onPageTransitionStart'
  | 'onPageTransitionEnd'
  | 'onRenderHtml'
  | 'onRenderClient'
  | 'guard'
  | 'data'
type HookNameGlobal = 'onBeforePrerender' | 'onBeforeRoute' | 'onPrerenderStart'
// v0.4 design TODO/v1-release: remove
type HookNameOldDesign = 'render' | 'prerender'

type ConfigNameBuiltIn =
  | Exclude<keyof Config, keyof ConfigVikeUserProvided | 'onBeforeRoute' | 'onPrerenderStart'>
  | 'prerender'
  | 'isClientSideRenderable'
  | 'onBeforeRenderEnv'
  | 'dataEnv'
  | 'hooksTimeout'

type Config = ConfigBuiltIn &
  Vike.Config &
  (
    | VikePackages.ConfigVikeReact
    | VikePackages.ConfigVikeVue
    | VikePackages.ConfigVikeSolid
    | VikePackages.ConfigVikeSvelte
  )

// Purposeful code duplication for improving QuickInfo IntelliSense
/** Hook for fetching data.
 *
 *  https://vike.dev/data
 */
type DataAsync = (pageContext: PageContextServer) => Promise<unknown>
/** Hook for fetching data.
 *
 *  https://vike.dev/data
 */
type DataSync = (pageContext: PageContextServer) => unknown
/** Protect page(s), e.g. forbid unauthorized access.
 *
 *  https://vike.dev/guard
 */
type GuardAsync = (pageContext: PageContextServer) => Promise<void>
/** Protect page(s), e.g. forbid unauthorized access.
 *
 *  https://vike.dev/guard
 */
type GuardSync = (pageContext: PageContextServer) => void
/** Global Hook called before the whole pre-rendering process starts.
 *
 * https://vike.dev/onBeforePrerenderStart
 */
type OnBeforePrerenderStartAsync = () => Promise<
  (
    | string
    | {
        url: string
        pageContext: Partial<Vike.PageContext>
      }
  )[]
>
/** Global Hook called before the whole pre-rendering process starts.
 *
 * https://vike.dev/onBeforePrerenderStart
 */
type OnBeforePrerenderStartSync = () => (
  | string
  | {
      url: string
      pageContext: Partial<Vike.PageContext>
    }
)[]
/** Hook called before the page is rendered.
 *
 *  https://vike.dev/onBeforeRender
 */
type OnBeforeRenderAsync = (
  pageContext: PageContextServer
) => Promise<{ pageContext: Partial<Vike.PageContext> } | void>
/** Hook called before the page is rendered.
 *
 *  https://vike.dev/onBeforeRender
 */
type OnBeforeRenderSync = (pageContext: PageContextServer) => { pageContext: Partial<Vike.PageContext> } | void
/** Hook called before the URL is routed to a page.
 *
 * https://vike.dev/onBeforeRoute
 */
type OnBeforeRouteAsync = (pageContext: PageContextServer) => Promise<{
  pageContext: Partial<
    | {
        /** The URL you provided to Vike when calling `renderPage({ urlOriginal })` in your server middleware.
         *
         * https://vike.dev/renderPage
         */
        urlOriginal: string
      }
    | Vike.PageContext
  >
}>
/** Hook called before the URL is routed to a page.
 *
 * https://vike.dev/onBeforeRoute
 */
type OnBeforeRouteSync = (pageContext: PageContextServer) => {
  pageContext: Partial<
    | {
        /** The URL you provided to Vike when calling `renderPage({ urlOriginal })` in your server middleware.
         *
         * https://vike.dev/renderPage
         */
        urlOriginal: string
      }
    | Vike.PageContext
  >
}
/** Hook called after the page is hydrated.
 *
 * https://vike.dev/onHydrationEnd
 */
type OnHydrationEndAsync = (pageContext: PageContextClient) => Promise<void>
/** Hook called after the page is hydrated.
 *
 * https://vike.dev/onHydrationEnd
 */
type OnHydrationEndSync = (pageContext: PageContextClient) => void
/** Hook called after the user navigates to a new page.
 *
 * https://vike.dev/onPageTransitionEnd
 */
type OnPageTransitionEndAsync = (pageContext: PageContextClient) => Promise<void>
/** Hook called after the user navigates to a new page.
 *
 * https://vike.dev/onPageTransitionEnd
 */
type OnPageTransitionEndSync = (pageContext: PageContextClient) => void
/** Hook called before the user navigates to a new page.
 *
 * https://vike.dev/onPageTransitionStart
 */
type OnPageTransitionStartAsync = (pageContext: PageContextClient) => Promise<void>
/** Hook called before the user navigates to a new page.
 *
 * https://vike.dev/onPageTransitionStart
 */
type OnPageTransitionStartSync = (pageContext: PageContextClient) => void
/** Page Hook called when pre-rendering starts.
 *
 * https://vike.dev/onPrerenderStart
 */
type OnPrerenderStartAsync = (prerenderContext: {
  pageContexts: PageContextServer[]
}) => Promise<{ prerenderContext: { pageContexts: PageContextServer[] } }>
/** Page Hook called when pre-rendering starts.
 *
 * https://vike.dev/onPrerenderStart
 */
type OnPrerenderStartSync = (prerenderContext: { pageContexts: PageContextServer[] }) => {
  prerenderContext: { pageContexts: PageContextServer[] }
}
/** Hook called when page is rendered on the client-side.
 *
 * https://vike.dev/onRenderClient
 */
type OnRenderClientAsync = (pageContext: PageContextClient) => Promise<void>
/** Hook called when page is rendered on the client-side.
 *
 * https://vike.dev/onRenderClient
 */
type OnRenderClientSync = (pageContext: PageContextClient) => void
/** Hook called when page is rendered to HTML on the server-side.
 *
 * https://vike.dev/onRenderHtml
 */
type OnRenderHtmlAsync = (pageContext: PageContextServer) => Promise<
  | DocumentHtml
  | {
      documentHtml: DocumentHtml
      pageContext:
        | OnRenderHtmlPageContextReturn
        // See https://vike.dev/stream#initial-data-after-stream-end
        | (() => Promise<OnRenderHtmlPageContextReturn> | OnRenderHtmlPageContextReturn)
    }
>
/** Hook called when page is rendered to HTML on the server-side.
 *
 * https://vike.dev/onRenderHtml
 */
type OnRenderHtmlSync = (pageContext: PageContextServer) =>
  | DocumentHtml
  | {
      documentHtml: DocumentHtml
      pageContext:
        | OnRenderHtmlPageContextReturn
        // See https://vike.dev/stream#initial-data-after-stream-end
        | (() => Promise<OnRenderHtmlPageContextReturn> | OnRenderHtmlPageContextReturn)
    }
type OnRenderHtmlPageContextReturn = Partial<
  Vike.PageContext & {
    /** See https://vike.dev/stream */
    enableEagerStreaming: boolean
  }
>
/** @deprecated Use a sync route() with an async guard() instead */
type RouteAsync = (
  pageContext: PageContextServer | PageContextClient
) => Promise<{ routeParams?: Record<string, string>; precedence?: number } | boolean>
/** The page's URL(s).
 *
 *  https://vike.dev/route
 */
type RouteSync = (
  pageContext: PageContextServer | PageContextClient
) => { routeParams?: Record<string, string>; precedence?: number } | boolean
/** The page's URL(s).
 *
 *  https://vike.dev/route
 */

// TODO: write docs of links below

/** Page configuration.
 *
 * https://vike.dev/config
 */
type ConfigBuiltIn = {
  /** The page's root component */
  Page?: unknown

  /** The page's URL(s).
   *
   *  https://vike.dev/route
   */
  route?: string | RouteAsync | RouteSync | ImportString

  /** Protect page(s), e.g. forbid unauthorized access.
   *
   *  https://vike.dev/guard
   */
  guard?: GuardAsync | GuardSync | ImportString
  /**
   * Whether to pre-render the page(s).
   *
   * https://vike.dev/pre-rendering
   */
  prerender?: boolean | ImportString

  /**
   * Inherit from other configurations.
   *
   * https://vike.dev/extends
   */
  extends?: Config | Config[] | ImportString | ImportString[]

  /** Hook called before the page is rendered.
   *
   *  https://vike.dev/onBeforeRender
   */
  onBeforeRender?: OnBeforeRenderAsync | OnBeforeRenderSync | ImportString | null

  /** Hook for fetching data.
   *
   *  https://vike.dev/data
   */
  data?: DataAsync | DataSync | ImportString | null

  /** Determines what pageContext properties are sent to the client-side.
   *
   * https://vike.dev/passToClient
   */
  passToClient?: string[] | ImportString

  /** Hook called when page is rendered on the client-side.
   *
   * https://vike.dev/onRenderClient
   */
  onRenderClient?: OnRenderClientAsync | OnRenderClientSync | ImportString
  /** Hook called when page is rendered to HTML on the server-side.
   *
   * https://vike.dev/onRenderHtml
   */
  onRenderHtml?: OnRenderHtmlAsync | OnRenderHtmlSync | ImportString

  /** Enable async Route Functions.
   *
   * https://vike.dev/route-function#async
   */
  iKnowThePerformanceRisksOfAsyncRouteFunctions?: boolean | ImportString

  /** Change the URL root of Filesystem Routing.
   *
   * https://vike.dev/filesystemRoutingRoot
   */
  filesystemRoutingRoot?: string | ImportString

  /** Page Hook called when pre-rendering starts.
   *
   * https://vike.dev/onPrerenderStart
   */
  onPrerenderStart?: OnPrerenderStartAsync | OnPrerenderStartSync | ImportString
  /** Global Hook called before the whole pre-rendering process starts.
   *
   * https://vike.dev/onBeforePrerenderStart
   */
  onBeforePrerenderStart?: OnBeforePrerenderStartAsync | OnBeforePrerenderStartSync | ImportString

  /** Hook called before the URL is routed to a page.
   *
   * https://vike.dev/onBeforeRoute
   */
  onBeforeRoute?: OnBeforeRouteAsync | OnBeforeRouteSync | ImportString

  /** Hook called after the page is hydrated.
   *
   * https://vike.dev/onHydrationEnd
   */
  onHydrationEnd?: OnHydrationEndAsync | OnHydrationEndSync | ImportString
  /** Hook called before the user navigates to a new page.
   *
   * https://vike.dev/onPageTransitionStart
   */
  onPageTransitionStart?: OnPageTransitionStartAsync | OnPageTransitionStartSync | ImportString
  /** Hook called after the user navigates to a new page.
   *
   * https://vike.dev/onPageTransitionEnd
   */
  onPageTransitionEnd?: OnPageTransitionEndAsync | OnPageTransitionEndSync | ImportString

  /** Whether the UI framework (React/Vue/Solid/...) allows the page's hydration to be aborted.
   *
   * https://vike.dev/hydrationCanBeAborted
   */
  hydrationCanBeAborted?: boolean | ImportString
  /** Additional client code.
   *
   * https://vike.dev/client
   */
  client?: string | ImportString
  /** Enable Client Routing.
   *
   * https://vike.dev/clientRouting
   */
  clientRouting?: boolean | ImportString

  /** Create new or modify existing configurations.
   *
   * https://vike.dev/meta
   */
  meta?: ConfigMeta | ImportString

  /** Prefetch links.
   *
   * https://vike.dev/prefetchStaticAssets
   */
  prefetchStaticAssets?: PrefetchStaticAssets | ImportString

  /** Modify the tiemouts of hooks. */
  hooksTimeout?: HooksTimeoutProvidedByUser
}
type ConfigMeta = Record<string, ConfigDefinition>
type ImportString = `import:${string}`
