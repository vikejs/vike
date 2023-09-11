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

type ConfigVikePackagesIntersection = ConfigVikeReact & ConfigVikeVue & ConfigVikeSolid & ConfigVikeSvelte
type ConfigVikePacakgesCombined = Combine<
  ConfigVikeReact,
  Combine<ConfigVikeVue, Combine<ConfigVikeSolid, ConfigVikeSvelte>>
>
type ConfigVikePacakgesNotEmptyXor = XOR4<
  IsNotEmpty<ConfigVikeReact>,
  IsNotEmpty<ConfigVikeVue>,
  IsNotEmpty<ConfigVikeSolid>,
  IsNotEmpty<ConfigVikeSvelte>
>
type IsNotEmpty<T> = Not<IsEmpty<T>>
// Playground: https://www.typescriptlang.org/play?ssl=2&ssc=1&pln=3&pc=1#code/C4TwDgpgBAkgzgUQLZlAHgCoD4oF4oDWEIA9gGZQZQQAewEAdgCZxQMQBuEATlAPxRg3AK7QAXFDIBDADZwIAbgCwAKFUB6dVAQ0pKGRFUBLBvW7SAxtGSoQUAN4BfY6Z6XoAORINkwMHftVKCgwbhIwCTghEwBzZRVnFVBIKCNEFFAARjxYdNs0G1AcKE1BEUMk8Gg0wpAAJhz4WrQvHyQ-EBxS6TkIIA
type IsEmpty<T> = keyof T extends never ? true : false

// Like Config but meant for pageContext.config
type PageContextConfig = ConfigCore &
  (ConfigVikePacakgesNotEmptyXor extends true ? ConfigVikePackagesIntersection : ConfigVikePacakgesCombined)

// Like union but on a prop level
//  - Playground: https://www.typescriptlang.org/play?#code/C4TwDgpgBAwg9gWwEYEsB2EA8AVAjAGimwCYA+KAXigG8BYAKCigG0BpKdKAawhDgDMiuKAB9uvAUWIBdAPwAuKAAp2EAB7AIaACYBncX0F4osoW2lRFGAG4QATgEpRy1Rq16DkkiannLUG3sHBgBfAG4GBlBIKABVNBQ4NGw4AEk0TTtdCABjYES0TFjyKiVYqHVNHX0AQzQQHyUuRVinCnJrOBRtf0DHCrdq5WaONH57KFS2jq6e01TeiFs7CPoo8GhsAFcwABsIFPTM7LyCnAGqjzqQZmkSuISkw4z7E-yknGY0LeR7O9X1jF4Mh0BAAEq5LZZFC2c6Vdz6CE5OB2bSYXTAOzoADmhGupFu922ewOaReWVy70KDCYdEYTBY7E4PEMRGkimBqAwn1Y0kI1BCpFWTBCDCFkXoAHpJVAAKJqGoIElQLa6GrYiDyQHQACydUoNBpAUVmqgGKxaGxwqg6tN31+K1CAPo0WgABE4NiDXSmGgTYpzTjrUg7BAINoA5ig06Ja7YDU7N6jQgajxIxarcm4NoILt09H6OFYxtYAbOaCkVDdDCsMw9WhCB7cfG7HdizEAArCKgwZgAcj9CAgfek2qgHeIZf7KZ4I7HHYAzFO+7a52t6Mi0BioMiQRgI6WqD7jUPFAAiABScAAFmgz-gjbbFAuAAwP+khsMHs8AGRqIZqbQUXvZNU1NM8Uj4YAahA+kEGzXNzxgRU7BAWCi3oIA
type Combine<T1, T2> = {
  [K in keyof T1 | keyof T2]?: (K extends keyof T1 ? T1[K] : never) | (K extends keyof T2 ? T2[K] : never)
}

// Unit test playground: https://www.typescriptlang.org/play?#code/C4TwDgpgBAGg8gJQCwB4AqBGKEAewIB2AJgM5QBGA9pQDYQCGBANFGgEzZ6GkXV2Ms0AZk75iZKrQbNWSUdwl9pAPigBeKAAoAsACgorLLjE9gAJwCuEPQYMB+Vh2MKo5qzdv2oAM3o0S1vqeUABcrCLO4q6WgcG2Dr7+sXGhUABylMDoSMoeBmHs8lFuyZ4OwkWmMXnBCX4BNZ5hGVloOY2pFZFV7kFxDi3ZuX3BBUh6AJR6oJDpmeiVilKMqhpoi9FWUHVJqSV60+DQaBAkwAAMBhrwyCiJASz3EI-1zz6vygDcBgD0P1AAZQAFpQLDQiBRoE9DrMTmcsOpYIhUE8Xkk0Q9NtAvr9-sDQeDIViYcdTsAOIibijXhi3iUoLScVA-oCQWCIeRoPtdDNSWcRJTkXcae90ViGeKmSz8eyidCeUdWGS5ILbqjxbTGd9mXi2YTOcSFbCyQBWK5ItUi+mayXa6V6jlQ14kpVnABs5qpwrF1o1ooCUt1BMd-sCvNdwAA7J6herffGYlBA6zg3LnUa+cAABwx26+9UFj52oOyg3c8Nw4AATlzqHzIrjieTMv1TqSLsrGEu1yF9Z9ia1uJTpbbDQzEYwWB7eYHoZYCa2zYdafb487HGnddnfcxTyXqYN8orZIwIk3KAX0Bt9P3I9DHZPcnPl4lO4gt9b97XJ7Nz+3-62ecm2LYdPyeIA
// prettier-ignore
type XOR4<T1 extends boolean, T2 extends boolean, T3 extends boolean, T4 extends boolean> = (
  T1 extends true
    ? T2 extends true
      ? false
      : T3 extends true
        ? false
        : Not<T4>
    : T2 extends true
      ? T3 extends true
        ? false
        : Not<T4>
      : T3 extends true
        ? Not<T4>
        : T4
)
type Not<T extends boolean> = T extends true ? false : true

interface ConfigVikePackages {} // For vike-* packages that don't conflict, e.g. the `isr` config of vike-vercel
// Because of conflicts, e.g. the Page config, we need a different interface for each vike-{react/vue/solid/svelte}
interface ConfigVikeReact {} // For vike-react
interface ConfigVikeVue {} // For vike-vue
interface ConfigVikeSolid {} // For vike-solid
interface ConfigVikeSvelte {} // For vike-svelte (doesn't exist yet)

type ConfigMeta = Record<string, ConfigDefinition>

type ImportString = `import:${string}`
