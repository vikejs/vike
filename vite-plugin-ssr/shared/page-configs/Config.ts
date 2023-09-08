export type { Config }
export type { ConfigNameBuiltIn }
export type { ConfigMeta }
export type { HookName }
export type { ConfigVikePackages }
export type { ConfigVikeReact }
export type { ConfigVikeVue }
export type { ConfigVikeSolid }
export type { ConfigVikeSvelte }
export type { PageContextConfig }

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
type ConfigNameBuiltInInternal = 'isClientSideRenderable' | 'onBeforeRenderEnv'
type ConfigNameBuiltIn = ConfigNameBuiltInPublic | ConfigNameBuiltInInternal


type Config = ConfigCore & ConfigVikePackages & (ConfigVikeReact | ConfigVikeVue | ConfigVikeSolid | ConfigVikeSvelte)

/** Page configuration.
 *
 * https://vite-plugin-ssr.com/config
 */
type ConfigCore<Page = unknown> = {
  Page?: Page

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
}

type ConfigPacakgesCombined = Combine<ConfigVikeReact, Combine<ConfigVikeVue, Combine<ConfigVikeSolid, ConfigVikeSvelte>>>
type ConfigVikePackagesIntersectionXor = ConfigVikeReact & ConfigVikeVue & ConfigVikeSolid & ConfigVikeSvelte
type ConfigVikePacakgesNonEmptyXor = IsNonEmptyXor<ConfigVikeReact, IsNonEmptyXor<ConfigVikeVue, IsNonEmptyXor<ConfigVikeSolid, ConfigVikeSvelte>>>

// Like Config but meant for pageContext.config
type PageContextConfig = ConfigCore & (ConfigVikePacakgesNonEmptyXor extends true ? ConfigVikePackagesIntersectionXor : ConfigPacakgesCombined)

// Like union but on a prop level
//  - Playground: https://www.typescriptlang.org/play?#code/C4TwDgpgBAwg9gWwEYEsB2EA8AVAjAGimwCYA+KAXigG8BYAKCigG0BpKdKAawhDgDMiuKAB9uvAUWIBdAPwAuKAAp2EAB7AIaACYBncX0F4osoW2lRFGAG4QATgEpRy1Rq16DkkiannLUG3sHBgBfAG4GBlBIKABVNBQ4NGw4AEk0TTtdCABjYES0TFjyKiVYqHVNHX0AQzQQHyUuRVinCnJrOBRtf0DHCrdq5WaONH57KFS2jq6e01TeiFs7CPoo8GhsAFcwABsIFPTM7LyCnAGqjzqQZmkSuISkw4z7E-yknGY0LeR7O9X1jF4Mh0BAAEq5LZZFC2c6Vdz6CE5OB2bSYXTAOzoADmhGupFu922ewOaReWVy70KDCYdEYTBY7E4PEMRGkimBqAwn1Y0kI1BCpFWTBCDCFkXoAHpJVAAKJqGoIElQLa6GrYiDyQHQACydUoNBpAUVmqgGKxaGxwqg6tN31+K1CAPo0WgABE4NiDXSmGgTYpzTjrUg7BAINoA5ig06Ja7YDU7N6jQgajxIxarcm4NoILt09H6OFYxtYAbOaCkVDdDCsMw9WhCB7cfG7HdizEAArCKgwZgAcj9CAgfek2qgHeIZf7KZ4I7HHYAzFO+7a52t6Mi0BioMiQRgI6WqD7jUPFAAiABScAAFmgz-gjbbFAuAAwP+khsMHs8AGRqIZqbQUXvZNU1NM8Uj4YAahA+kEGzXNzxgRU7BAWCi3oIA
type Combine<T1, T2> = {
  [K in keyof T1 | keyof T2]?: (K extends keyof T1 ? T1[K] : never) | (K extends keyof T2 ? T2[K] : never)
}

// Check whether only a single interface is non-empty
// - Playground: https://www.typescriptlang.org/play?#code/C4TwDgpgBAkgzgOQPYDsCiBbMoAaSBOAPACoCMANFMQEwB8UAvFDgPIBKh8m2IJptlLllAk6tANwBYAFChIsONxHF6TANYQQSAGZUoEAB7AIKACZwoKCADcI+KAH4owfAFdoALijaAhgBs4CClZcGhWDmJ9IxNzKAAjJCQ-CB8USgBVKOMzCwSklJRVKAAKSMNs2Jd3RxLM8piLKugnXwDPZzcIAEooL3Su4JkAeiGoNAMfLGSZAEsUY3xfAGNoJRAoAG8AX1n5u2XoZHQMYDB1jZkoKDB8JDAvOBc5gHNgnZD5GcVhEFJGBTWhDW9CgIw67hkcmgXzW1H+Qh4hCOmFOIHoYNagUhoSgMJ+eHwcKY8GR+IIQJ+lGBoNGmIg2M+3x4BL+xMQqDWBIpPEopNR6NGTQZ0KZuAIAGZ4ezjszyXyzlSfgLwfSPiLOQQACxS0myojykC8jknM7KulAA
type IsNonEmptyXor<T1, T2> = XOR<IsEmpty<T1>, IsEmpty<T2>>;
type IsEmpty<T> = keyof T extends never ? true : false;
type XOR<T extends boolean, U extends boolean> = (T extends true ? (U extends true ? false : true) : U);

interface ConfigVikePackages {} // For vike-* packages that don't conflict, e.g. the `isr` config of vike-vercel
// Because of conflicts, e.g. the Page config, we need a different interface for each vike-{react/vue/solid/svelte}
interface ConfigVikeReact {} // For vike-react
interface ConfigVikeVue {} // For vike-vue
interface ConfigVikeSolid {} // For vike-solid
interface ConfigVikeSvelte {} // For vike-svelte (doesn't exist yet)

type ConfigMeta = Record<string, ConfigDefinition>

type ImportString = `import:${string}`
