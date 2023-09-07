export type { Config }
export type { ConfigNameBuiltIn }
export type { ConfigMeta }
export type { HookName }

import type { PrefetchStaticAssets } from '../../client/client-routing-runtime/prefetch/getPrefetchSettings.js'
import { ConfigDefinition } from '../../node/plugin/plugins/importUserCode/v1-design/getVikeConfig/configDefinitionsBuiltIn.js'
import type { ConfigVpsUserProvided } from '../ConfigVps.js'
// TODO: write docs of links below

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
  | Exclude<keyof Config, keyof ConfigVpsUserProvided | 'onBeforeRoute' | 'onPrerenderStart'>
  | 'prerender'
  | 'Page'
type ConfigNameBuiltInInternal = 'isClientSideRenderable' | 'onBeforeRenderEnv'
type ConfigNameBuiltIn = ConfigNameBuiltInPublic | ConfigNameBuiltInInternal

/** Page configuration.
 *
 * https://vite-plugin-ssr.com/config
 */
type Config<Page = never> = {
  Page?: FallbackToUnkown<
    | Page
    | PickIfExists<ConfigInterface, 'Page'>
    | PickIfExists<ConfigInterfaceVikeReact, 'Page'>
    | PickIfExists<ConfigInterfaceVikeVue, 'Page'>
    | PickIfExists<ConfigInterfaceVikeSolid, 'Page'>
    | PickIfExists<ConfigInterfaceVikeSvelte, 'Page'>
  >

  /** The page's URL(s).
   *
   *  https://vite-plugin-ssr.com/route
   */
  route?: string | Function | ImportString

  /** Protect page(s), e.g. forbid unauthorized access.
   *
   *  https://vite-plugin-ssr.com/guard
   */
  guard?: Function | ImportString
  /**
   * Whether to pre-render the page(s).
   *
   * https://vite-plugin-ssr.com/pre-rendering
   */
  prerender?: boolean | ImportString

  /**
   * Inherit from other configurations.
   *
   * https://vite-plugin-ssr.com/extends
   */
  extends?: Config | Config[] | ImportString | ImportString[]

  /** Hook called before the page is rendered, usually for fetching data.
   *
   *  https://vite-plugin-ssr.com/onBeforeRender
   */
  onBeforeRender?: Function | ImportString | null

  /** Determines what pageContext properties are sent to the client-side.
   *
   * https://vite-plugin-ssr.com/passToClient
   */
  passToClient?: string[] | ImportString

  /** Hook called when page is rendered on the client-side.
   *
   * https://vite-plugin-ssr.com/onRenderClient
   */
  onRenderClient?: Function | ImportString
  /** Hook called when page is rendered to HTML on the server-side.
   *
   * https://vite-plugin-ssr.com/onRenderHtml
   */
  onRenderHtml?: Function | ImportString

  /** Enable async Route Functions.
   *
   * https://vite-plugin-ssr.com/route-function#async
   */
  iKnowThePerformanceRisksOfAsyncRouteFunctions?: boolean | ImportString

  /** Change the URL root of Filesystem Routing.
   *
   * https://vite-plugin-ssr.com/filesystemRoutingRoot
   */
  filesystemRoutingRoot?: string | ImportString

  /** Page Hook called when pre-rendering starts.
   *
   * https://vite-plugin-ssr.com/onPrerenderStart
   */
  onPrerenderStart?: Function | ImportString
  /** Global Hook called before the whole pre-rendering process starts.
   *
   * https://vite-plugin-ssr.com/onBeforePrerenderStart
   */
  onBeforePrerenderStart?: Function | ImportString

  /** Hook called before the URL is routed to a page.
   *
   * https://vite-plugin-ssr.com/onBeforeRoute
   */
  onBeforeRoute?: Function | ImportString

  /** Hook called after the page is hydrated.
   *
   * https://vite-plugin-ssr.com/clientRouting
   */
  onHydrationEnd?: Function | ImportString
  /** Hook called before the user navigates to a new page.
   *
   * https://vite-plugin-ssr.com/clientRouting
   */
  onPageTransitionStart?: Function | ImportString
  /** Hook called after the user navigates to a new page.
   *
   * https://vite-plugin-ssr.com/clientRouting
   */
  onPageTransitionEnd?: Function | ImportString

  /** Whether the UI framework (React/Vue/Solid/...) allows the page's hydration to be aborted.
   *
   * https://vite-plugin-ssr.com/clientRouting
   */
  hydrationCanBeAborted?: boolean | ImportString
  /** Additional client code.
   *
   * https://vite-plugin-ssr.com/client
   */
  client?: string | ImportString
  /** Enable Client Routing.
   *
   * https://vite-plugin-ssr.com/clientRouting
   */
  clientRouting?: boolean | ImportString

  /** Create new or modify existing configurations.
   *
   * https://vite-plugin-ssr.com/meta
   */
  meta?: ConfigMeta | ImportString

  /** Prefetch links.
   *
   * https://vite-plugin-ssr.com/clientRouting#link-prefetching
   */
  prefetchStaticAssets?: PrefetchStaticAssets | ImportString
} & Omit<ConfigInterface, 'Page'> &
  (
    | Omit<ConfigInterfaceVikeReact, 'Page'>
    | Omit<ConfigInterfaceVikeVue, 'Page'>
    | Omit<ConfigInterfaceVikeSolid, 'Page'>
    | Omit<ConfigInterfaceVikeSvelte, 'Page'>
  )

// - Interface merging doesn't support conflict resolution (it doesn't support override nor union)
//   - Playground: https://www.typescriptlang.org/play?ssl=6&ssc=1&pln=7&pc=1#code/PTAEHUHsCcGsEsB2BzUSAuBTaAzAhgMaagCui8kiAsAFAbb5GgCyeioA3raKIngLaYAXKADO6aEmS0AvrXq5CxACKRUXGjz6CRiEvwBG2WbXQBPAA7FWiAPLRVqALws2oAD6hHAblOXiAAqgLjb2jgDaAOTamJEAurS0IKAAkohYikyC0MhSoAAmkJiiiJHoBZCg6AAWxGQU1HTpDEqgAEKQAB6c3GLwAF7CvPpG0CZNGYzEHd0aPKIDQ+KSKONAA
//   - We support union by doing:
//     ```ts
//     type Config = ConfigInterface | ConfigInterfaceVikeReact | ...
//     ```
interface ConfigInterface {} // For vike-* packages without potentiel for conflicts, e.g. the `isr` config of vike-vercel
// Conflict resolution in case the user uses both vike-react and vike-vue => the config Page should be the union
interface ConfigInterfaceVikeReact {} // For vike-react
interface ConfigInterfaceVikeVue {} // For vike-vue
interface ConfigInterfaceVikeSolid {} // For vike-solid
interface ConfigInterfaceVikeSvelte {} // For vike-svelte (doesn't exist yet)

// Union of each property, instead of:
// ```ts
// // Union on a
// type ManOrDog = Man | Dog
// ```
//type UnionOnPropLevel =`

type P = Config['Page']
type R = Config['route']
type G = Config['guard']

// Playground: https://www.typescriptlang.org/play?ssl=23&ssc=1&pln=24&pc=1#code/LAKALgngDgpgBAYQPYDsBmBLA5gHgAoCGW8AvHCjAG4wBOAfHGQN6iHEBccAYgQDa8AjAgGMA1gBUkAVRSikAdxT4i8AD5w8GMQEk0AUQAeGAM5hjARhzJ02bSjC00ImOYA0cAORsYHhus06+kamFlaomFh2DjROwjAATO5eKr50oAC+oKCQsHAAIuaMGlqiuoYmZpbWEVGOzm6eeUgwxgBySGDlpr5w6gJISLwwBCjZ0PB58UU8-EJikjJyivglZcGVYTaR9nVxDR5NLe2d66lZ4OMaRdXYANoARN73ALrnGDsxzojhth+xLnAWCA4HAAPSggBUoBB3k4ABYptCwZDQRk3n8vjdttF-lMgSDwVDgRoVJwAMwAdiRhNRIEyIHROK+ACEkAZAUjjMI+DAAPycZm-BzEGgAbjRDIuuQAgkVWeyYAYHCgACbGQFwLk8-lwACushQChQcHScF5cHltw8WqGHmecE4FGoNHO4LgAHUkDRROq0F64O8mXF3CrmsYUB4wHB5F7RHA-TQ4DkYGNcgFSkEKqFxO48DQkFA4IrlWqNPnYDRIABpGAQBhkcRFpUwVXqphwW5VgPGvMF56cEYQE1muDiW69qD2x1UWigN2e72+-3JkNhiNRmPe+P+wO7FNS+DptZZ+I4HNlgtNkvqie0au1+ujq8t0vtzvdi+TnWD4fmscTqdyBnF1JWTbg+EEEQJGkWQjTPR9bnEe1ixfdVbidWh7XNfVRENRQHVHc4wOZQoyCPTMQlPeUkhtHwGFTeAEFI4pAi6MwqLZGjuSGeJfAYi0pjIGZIPmGCliUEi0gPRBBPA2YoIWWDliYuggA
type PickIfExists<T, Prop extends PropertyKey> = T extends { [K in Prop]: any } ? T[Prop] : never
type FallbackToUnkown<T> = [T] extends [never] ? unknown : T

type ConfigMeta = Record<string, ConfigDefinition>

type ImportString = `import:${string}`
