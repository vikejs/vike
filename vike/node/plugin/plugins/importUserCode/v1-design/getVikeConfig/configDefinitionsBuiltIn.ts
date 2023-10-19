export { configDefinitionsBuiltIn }
export { configDefinitionsBuiltInGlobal }
export type { ConfigDefinition }
export type { ConfigDefinitionInternal }
export type { ConfigNameGlobal }
export type { ConfigEffect }

import type {
  ConfigEnvInternal,
  ConfigEnv,
  PageConfigBuildTime
} from '../../../../../../shared/page-configs/PageConfig.js'
import type { Config, ConfigNameBuiltIn } from '../../../../../../shared/page-configs/Config.js'
import { getConfigEnv, isConfigSet } from '../helpers.js'

// For users
/** The meta definition of a config.
 *
 * https://vike.dev/meta
 */
type ConfigDefinition = {
  /** In what environment(s) the config value is loaded.
   *
   * https://vike.dev/meta
   */
  env: ConfigEnv
  /** Disable config overriding and make config values cumulative instead.
   *
   * @default false
   *
   * https://vike.dev/meta
   */
  cumulative?: boolean
  /**
   * Define a so-called "Shortcut Config".
   *
   * https://vike.dev/meta
   */
  effect?: ConfigEffect
}

type ConfigEffect = (config: {
  /** The config value.
   *
   * https://vike.dev/meta
   */
  configValue: unknown
  /** Where the config value is defined.
   *
   * https://vike.dev/meta
   */
  configDefinedAt: `Config ${string}`
}) => Config | undefined

/** For Vike internal use */
type ConfigDefinitionInternal = Omit<ConfigDefinition, 'env'> & {
  _computed?: (pageConfig: PageConfigBuildTime) => unknown
  _valueIsFilePath?: true
  env: ConfigEnvInternal
}

type ConfigDefinitionsBuiltIn = Record<ConfigNameBuiltIn, ConfigDefinitionInternal>
const configDefinitionsBuiltIn: ConfigDefinitionsBuiltIn = {
  onRenderHtml: {
    env: 'server-only'
  },
  onRenderClient: {
    env: 'client-only'
  },
  onHydrationEnd: {
    env: 'client-only'
  },
  onPageTransitionStart: {
    env: 'client-only'
  },
  onPageTransitionEnd: {
    env: 'client-only'
  },
  onBeforeRender: {
    env: 'server-only'
  },
  onBeforePrerenderStart: {
    env: 'server-only'
  },
  Page: {
    env: 'server-and-client'
  },
  passToClient: {
    env: 'server-only',
    cumulative: true
  },
  route: {
    env: '_routing-eager'
  },
  guard: {
    env: '_routing-lazy'
  },
  iKnowThePerformanceRisksOfAsyncRouteFunctions: {
    env: '_routing-eager'
  },
  filesystemRoutingRoot: {
    env: 'config-only'
  },
  client: {
    // The value of the client config is merely the file path to the client entry file, which is only needed on the sever-side
    env: 'server-only',
    _valueIsFilePath: true
  },
  clientRouting: {
    env: 'server-and-client' // TODO: config-only instead?
  },
  prerender: {
    env: 'server-only'
  },
  hydrationCanBeAborted: {
    env: 'client-only' // TODO: config-only instead?
  },
  prefetchStaticAssets: {
    env: 'client-only' // TODO: config-only instead?
  },
  extends: {
    env: 'config-only'
  },
  meta: {
    env: 'config-only'
  },
  isClientSideRenderable: {
    env: 'server-and-client',
    _computed: (pageConfig): boolean =>
      isConfigSet(pageConfig, 'onRenderClient') &&
      isConfigSet(pageConfig, 'Page') &&
      getConfigEnv(pageConfig, 'Page') !== 'server-only'
  },
  onBeforeRenderEnv: {
    env: 'client-only',
    _computed: (pageConfig): null | ConfigEnvInternal =>
      !isConfigSet(pageConfig, 'onBeforeRender') ? null : getConfigEnv(pageConfig, 'onBeforeRender')
  }
}

type ConfigNameGlobal =
  | 'onPrerenderStart'
  | 'onBeforeRoute'
  | 'prerender'
  | 'extensions'
  | 'disableAutoFullBuild'
  | 'includeAssetsImportedByServer'
  | 'baseAssets'
  | 'baseServer'
  | 'redirects'
  | 'trailingSlash'
  | 'disableUrlNormalization'
const configDefinitionsBuiltInGlobal: Record<ConfigNameGlobal, ConfigDefinitionInternal> = {
  onPrerenderStart: {
    env: 'server-only'
  },
  onBeforeRoute: {
    env: '_routing-eager'
  },
  prerender: {
    env: 'config-only'
  },
  extensions: { env: 'config-only' },
  disableAutoFullBuild: { env: 'config-only' },
  includeAssetsImportedByServer: { env: 'config-only' },
  baseAssets: { env: 'config-only' },
  baseServer: { env: 'config-only' },
  redirects: { env: 'server-only' },
  trailingSlash: { env: 'server-only' },
  disableUrlNormalization: { env: 'server-only' }
}
