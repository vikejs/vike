export type { Config }
export type { ConfigBuiltIn }
export type { ConfigNameBuiltIn }
export type { ConfigMeta }
export type { HookName }

// NOTE(aurelien): to be removed
export type { Hook }
export type { HookParam }
export type { HookParams }
export type { HookReturnSync }
export type { HookReturnAsync }
export type { HookReturn }

// NOTE(aurelien): to be extended
export type { OnBeforeRender }
export type { OnBeforeRenderParam }
export type { OnBeforeRenderReturnSync }
export type { OnBeforeRenderReturn }

import type { PrefetchStaticAssets } from '../../client/client-routing-runtime/prefetch/getPrefetchSettings.js'
import type { ConfigDefinition } from '../../node/plugin/plugins/importUserCode/v1-design/getVikeConfig/configDefinitionsBuiltIn.js'
import type { DocumentHtml } from '../../node/runtime/html/renderHtml.js'
import type { ConfigVikeUserProvided } from '../ConfigVike.js'
import type { Vike, VikePackages } from '../VikeNamespace.js'
import type { PageContextClient, PageContextServer } from '../types.js'

type HookName =
  | 'onHydrationEnd'
  | 'onBeforePrerender'
  | 'onBeforePrerenderStart'
  | 'onBeforeRender'
  | 'onBeforeRoute'
  | 'onPageTransitionStart'
  | 'onPageTransitionEnd'
  | 'onPrerenderStart'
  | 'onRenderHtml'
  | 'onRenderClient'
  | 'guard'
  | 'render'

// Do we need the distinction between ConfigNameBuiltInPublic and ConfigNameBuiltInInternal?
type ConfigNameBuiltInPublic =
  | Exclude<keyof Config, keyof ConfigVikeUserProvided | 'onBeforeRoute' | 'onPrerenderStart'>
  | 'prerender'
type ConfigNameBuiltInInternal = 'isClientSideRenderable' | 'onBeforeRenderEnv'
type ConfigNameBuiltIn = ConfigNameBuiltInPublic | ConfigNameBuiltInInternal

type Config = ConfigBuiltIn &
  Vike.Config &
  (
    | VikePackages.ConfigVikeReact
    | VikePackages.ConfigVikeVue
    | VikePackages.ConfigVikeSolid
    | VikePackages.ConfigVikeSvelte
  )

type OptionalPromise<T> = T | Promise<T>

// NOTE(aurelien): to be removed
type Hook<Name extends keyof Config> = Extract<Config[Name], (...args: any) => any>
type HookParams<Name extends keyof Config, Index extends number> = Parameters<Hook<Name>>[Index]
type HookParam<Name extends keyof Config> = HookParams<Name, 0>
type HookReturnType<Name extends keyof Config> = ReturnType<Hook<Name>>
type HookReturnSync<Name extends keyof Config> = Exclude<HookReturnType<Name>, Promise<any>>
type HookReturnAsync<Name extends keyof Config> = Extract<HookReturnType<Name>, Promise<any>>
type HookReturn<Name extends keyof Config> = HookReturnAsync<Name>

// NOTE(aurelien): to be extended. I'm wondering if this is all worth it as I'm wondering if people
// will/should really use this style.
/**
 * `OnBeforeRenderParam` is an alias of `PageContextServer`:
 *
 *   `import type { PageContextServer } from 'vike/types'`
 *   `type OnBeforeRenderParam = PageContextServer`
 *
 * https://vike.dev/onBeforeRender#typescript */
type OnBeforeRenderParam = PageContextServer
/** https://vike.dev/onBeforeRender#typescript */
type OnBeforeRenderReturn = Promise<{ pageContext: Partial<Vike.PageContext> } | undefined>
// NOTE(brillout): Purposely doing code duplication for improving that quickinfo IntelliSense shows on hover
/** https://vike.dev/onBeforeRender#typescript */
type OnBeforeRenderReturnSync = { pageContext: Partial<Vike.PageContext> } | undefined
/** https://vike.dev/onBeforeRender */
type OnBeforeRender = (pageContext: OnBeforeRenderParam) => OnBeforeRenderReturn | OnBeforeRenderReturnSync

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
  route?: string | ((pageContext: PageContextServer) => { routeParams: Record<string, string> }) | ImportString

  /** Protect page(s), e.g. forbid unauthorized access.
   *
   *  https://vike.dev/guard
   */
  guard?: ((pageContext: PageContextServer) => OptionalPromise<void>) | ImportString
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

  /** Hook called before the page is rendered, usually for fetching data.
   *
   *  https://vike.dev/onBeforeRender
   */
  onBeforeRender?: OnBeforeRender | ImportString | null

  /** Determines what pageContext properties are sent to the client-side.
   *
   * https://vike.dev/passToClient
   */
  passToClient?: string[] | ImportString

  /** Hook called when page is rendered on the client-side.
   *
   * https://vike.dev/onRenderClient
   */
  onRenderClient?: ((pageContext: PageContextClient) => OptionalPromise<void>) | ImportString
  /** Hook called when page is rendered to HTML on the server-side.
   *
   * https://vike.dev/onRenderHtml
   */
  onRenderHtml?:
    | ((pageContext: PageContextServer) => OptionalPromise<
        | DocumentHtml
        | {
            documentHtml: DocumentHtml
            // See https://vike.dev/stream#initial-data-after-stream-end
            pageContext: Partial<Vike.PageContext> | (() => Promise<Partial<Vike.PageContext>>)
          }
      >)
    | ImportString

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
  onPrerenderStart?:
    | ((prerenderContext: {
        pageContexts: PageContextServer[]
      }) => OptionalPromise<{ prerenderContext: { pageContexts: PageContextServer[] } }>)
    | ImportString
  /** Global Hook called before the whole pre-rendering process starts.
   *
   * https://vike.dev/onBeforePrerenderStart
   */
  onBeforePrerenderStart?:
    | (() => OptionalPromise<
        (
          | string
          | {
              url: string
              pageContext: Partial<Vike.PageContext>
            }
        )[]
      >)
    | ImportString

  /** Hook called before the URL is routed to a page.
   *
   * https://vike.dev/onBeforeRoute
   */
  onBeforeRoute?:
    | ((pageContext: PageContextServer) => OptionalPromise<{ pageContext: Partial<Vike.PageContext> }>)
    | ImportString

  /** Hook called after the page is hydrated.
   *
   * https://vike.dev/clientRouting
   */
  onHydrationEnd?: (() => OptionalPromise<void>) | ImportString
  /** Hook called before the user navigates to a new page.
   *
   * https://vike.dev/clientRouting
   */
  onPageTransitionStart?: ((pageContext: PageContextClient) => void) | ImportString
  /** Hook called after the user navigates to a new page.
   *
   * https://vike.dev/clientRouting
   */
  onPageTransitionEnd?: ((pageContext: PageContextClient) => void) | ImportString

  /** Whether the UI framework (React/Vue/Solid/...) allows the page's hydration to be aborted.
   *
   * https://vike.dev/clientRouting
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
   * https://vike.dev/clientRouting#link-prefetching
   */
  prefetchStaticAssets?: PrefetchStaticAssets | ImportString
}
type ConfigMeta = Record<string, ConfigDefinition>
type ImportString = `import:${string}`
