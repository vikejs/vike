export type { Config }
export type { ConfigBuiltIn }
export type { ConfigBuiltInResolved }
export type { ConfigNameBuiltIn }
export type { ConfigNameGlobal }
export type { ConfigMeta }
export type { HookName }
export type { HookNamePage }
export type { HookNameGlobal }
export type { ImportString }

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
export type { Route }
export type { KeepScrollPosition }

import type {
  PrefetchSetting,
  PrefetchStaticAssets
} from '../../client/client-routing-runtime/prefetch/PrefetchSetting.js'
import type { ConfigDefinition } from '../../node/plugin/plugins/importUserCode/v1-design/getVikeConfig/configDefinitionsBuiltIn.js'
import type { DocumentHtml } from '../../node/runtime/html/renderHtml.js'
import type { InjectFilterEntry } from '../../types/index.js'
import type { VikeVitePluginOptions } from '../../node/plugin/index.js'
import type { Vike, VikePackages } from '../VikeNamespace.js'
import type { HooksTimeoutProvidedByUser } from '../hooks/getHook.js'
import type { PageContextClient, PageContextServer } from '../types.js'
import type { InlineConfig } from 'vite'

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
  | Exclude<keyof Config, keyof VikeVitePluginOptions | 'onBeforeRoute' | 'onPrerenderStart' | 'vite' | 'redirects'>
  | 'prerender'
  | 'isClientRuntimeLoaded'
  | 'onBeforeRenderEnv'
  | 'dataEnv'
  | 'hooksTimeout'
  | 'clientHooks'
  | 'middleware'

type ConfigNameGlobal =
  | 'onPrerenderStart'
  | 'onBeforeRoute'
  | 'prerender'
  | 'disableAutoFullBuild'
  | 'includeAssetsImportedByServer'
  | 'baseAssets'
  | 'baseServer'
  | 'redirects'
  | 'trailingSlash'
  | 'disableUrlNormalization'
  | 'vite'

type Config = ConfigBuiltIn &
  Vike.Config &
  (
    | VikePackages.ConfigVikeReact
    | VikePackages.ConfigVikeVue
    | VikePackages.ConfigVikeSolid
    | VikePackages.ConfigVikeSvelte
    | VikePackages.ConfigVikeAngular
  )

// Purposeful code duplication for improving QuickInfo IntelliSense
/** Hook for fetching data.
 *
 *  https://vike.dev/data
 */
type DataAsync<Data = unknown> = (pageContext: PageContextServer) => Promise<Data>
/** Hook for fetching data.
 *
 *  https://vike.dev/data
 */
type DataSync<Data = unknown> = (pageContext: PageContextServer) => Data
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
type OnBeforePrerenderStartAsync<Data = unknown> = () => Promise<
  (
    | string
    | {
        url: string
        pageContext: Partial<Vike.PageContext & { data: Data }>
      }
  )[]
>
/** Global Hook called before the whole pre-rendering process starts.
 *
 * https://vike.dev/onBeforePrerenderStart
 */
type OnBeforePrerenderStartSync<Data = unknown> = () => (
  | string
  | {
      url: string
      pageContext: Partial<Vike.PageContext & { data: Data }>
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
type OnRenderHtmlAsync = (pageContext: PageContextServer) => Promise<OnRenderHtmlReturn>
/** Hook called when page is rendered to HTML on the server-side.
 *
 * https://vike.dev/onRenderHtml
 */
type OnRenderHtmlSync = (pageContext: PageContextServer) => OnRenderHtmlReturn
type OnRenderHtmlReturn =
  | DocumentHtml
  | {
      injectFilter?: (assets: InjectFilterEntry[]) => void
      documentHtml?: DocumentHtml
      pageContext?:
        | OnRenderHtmlPageContextReturn
        // See https://vike.dev/streaming#initial-data-after-stream-end
        | (() => Promise<OnRenderHtmlPageContextReturn> | OnRenderHtmlPageContextReturn)
    }
type OnRenderHtmlPageContextReturn = Partial<
  Vike.PageContext & {
    /** See https://vike.dev/streaming */
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
type Route = string | RouteSync | RouteAsync

/** Whether the page scrolls to the top upon navigation.
 *
 * https://vike.dev/keepScrollPosition
 */
type KeepScrollPosition =
  | boolean
  | string
  | string[]
  | ((pageContext: PageContextClient) => boolean | string | string[])

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
  route?: Route | ImportString

  /** Protect page(s), e.g. forbid unauthorized access.
   *
   *  https://vike.dev/guard
   */
  guard?: GuardAsync | GuardSync | ImportString
  /**
   * Pre-render page(s).
   *
   * https://vike.dev/pre-rendering
   * https://vike.dev/prerender
   *
   * @default false
   */
  prerender?:
    | boolean
    | ImportString
    | {
        /**
         * Allow only some of your pages to be pre-rendered.
         *
         * This setting doesn't affect the pre-rendering process: it merely suppresses the warnings when some of your pages cannot be pre-rendered.
         *
         * https://vike.dev/prerender#partial
         *
         * @default false
         */
        partial?: boolean
        /**
         * Don't create a new directory for each HTML file.
         *
         * For example, generate `dist/client/about.html` instead of `dist/client/about/index.html`.
         *
         * https://vike.dev/prerender#noextradir
         *
         * @default false
         */
        noExtraDir?: boolean
        /**
         * Number of concurrent pre-render jobs.
         *
         * Set to `false` to disable concurrency.
         *
         * https://vike.dev/prerender#parallel
         *
         * @default os.cpus().length
         */
        parallel?: boolean | number
        /**
         * Disable the automatic initiation of the pre-rendering process when running `$ vike build`.
         *
         * Use this if you want to programmatically initiate the pre-rendering process instead.
         *
         * https://vike.dev/prerender#disableautorun
         *
         * @default false
         */
        disableAutoRun?: boolean
      }

  /**
   * Install Vike extensions.
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
  data?: DataAsync<unknown> | DataSync<unknown> | ImportString | null

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
  /** Add client code.
   *
   * https://vike.dev/client
   */
  client?: string | ImportString
  /** Enable Client Routing.
   *
   * https://vike.dev/clientRouting
   */
  clientRouting?: boolean | ImportString

  /**
   * Whether hooks are loaded on the client-side.
   *
   * https://vike.dev/clientHooks
   */
  clientHooks?: boolean | null | ImportString

  /** Create new or modify existing configurations.
   *
   * https://vike.dev/meta
   */
  meta?: ConfigMeta | ImportString

  /** Vite configuration.
   *
   * https://vite.dev/config/
   */
  vite?: InlineConfig

  /** Permanent redirections (HTTP status code 301)
   *
   * https://vike.dev/redirects
   */
  redirects?: Record<string, string>

  /** Whether URLs should end with a trailing slash.
   *
   * https://vike.dev/url-normalization
   *
   * @default false
   */
  trailingSlash?: boolean

  /** Disable automatic URL normalization.
   *
   * https://vike.dev/url-normalization
   *
   * @default false
   */
  disableUrlNormalization?: boolean

  // TODO/v1-release: remove
  /** @deprecated It's now `true` by default. You can remove this option. */
  includeAssetsImportedByServer?: boolean

  // TODO/v1-release: remove
  /** @deprecated See https://vike.dev/disableAutoFullBuild */
  disableAutoFullBuild?: boolean | 'prerender'

  /** Use Vite Environment API to orchestrate the build process.
   * @experimental
   */
  viteEnvironmentAPI?: boolean

  /** The Base URL of your server.
   *
   * https://vike.dev/base-url
   */
  baseServer?: string
  /** The Base URL of your static assets.
   *
   * https://vike.dev/base-url
   */
  baseAssets?: string

  // TODO/pageContext-prefetch: remove experimental note
  /**
   * @experimental DON'T USE: the API *will* have breaking changes upon any minor version release.
   *
   * Prefetch pages/links.
   *
   * https://vike.dev/prefetch
   */
  prefetch?: PrefetchSetting | ImportString

  // TODO/pageContext-prefetch: use following JSDoc to deprecate old interface.
  /** @deprecated Use `prefetch` setting (https://vike.dev/prefetch) instead.  */
  /** Prefetch links.
   *
   * https://vike.dev/prefetchStaticAssets
   */
  prefetchStaticAssets?: PrefetchStaticAssets | ImportString

  /** Modify the timeouts of hooks. */
  hooksTimeout?: HooksTimeoutProvidedByUser

  /** `Cache-Control` HTTP header value.
   *
   * Default: `no-store, max-age=0`
   *
   * Set to an empty string to not send the header.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
   */
  cacheControl?: string

  /** Where scripts are injected in the HTML.
   *
   * https://vike.dev/injectScriptsAt
   */
  injectScriptsAt?: 'HTML_BEGIN' | 'HTML_END' | 'HTML_STREAM' | null

  /** Used by Vike extensions to set their name.
   *
   * https://vike.dev/extends
   */
  name?: string

  /** Used by Vike extensions to enforce their peer dependencies.
   *
   * https://vike.dev/require
   */
  require?: Record<string, string>

  /** Whether the page scrolls to the top upon navigation.
   *
   * https://vike.dev/keepScrollPosition
   */
  keepScrollPosition?: KeepScrollPosition

  /** @experimental */
  middleware?: Function
}

type ConfigBuiltInResolved = {
  passToClient?: string[][]
  redirects?: Record<string, string>[]
  prerender?: Exclude<Config['prerender'], ImportString | undefined>[]
  middleware?: Function[]
}

type ConfigMeta = Record<string, ConfigDefinition>
type ImportString = `import:${string}`
