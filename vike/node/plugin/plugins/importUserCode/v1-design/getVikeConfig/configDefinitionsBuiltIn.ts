export { configDefinitionsBuiltIn }
export { configDefinitionsBuiltInGlobal }
export type { ConfigDefinition }
export type { ConfigDefinitionInternal }
export type { ConfigNameGlobal }
export type { ConfigEffect }

import type {
  ConfigEnvInternal,
  ConfigEnv,
  ConfigValueSources,
  DefinedAtFileFullInfo
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
  _computed?: (configValueSources: ConfigValueSources) => unknown
  _valueIsFilePath?: true
  _userEffectDefinedAt?: DefinedAtFileFullInfo
  env: ConfigEnvInternal
}

type ConfigDefinitionsBuiltIn = Record<ConfigNameBuiltIn, ConfigDefinitionInternal>
const configDefinitionsBuiltIn: ConfigDefinitionsBuiltIn = {
  onRenderHtml: {
    env: { server: true }
  },
  onRenderClient: {
    env: { client: true }
  },
  onHydrationEnd: {
    env: { client: true }
  },
  onPageTransitionStart: {
    env: { client: true }
  },
  onPageTransitionEnd: {
    env: { client: true }
  },
  onBeforeRender: {
    env: { server: true }
  },
  onBeforePrerenderStart: {
    env: { server: true }
  },
  Page: {
    env: { server: true, client: true }
  },
  passToClient: {
    env: { server: true, config: true },
    cumulative: true
  },
  route: {
    env: { server: true, client: 'if-client-routing', eager: true }
  },
  guard: {
    env: { server: true, client: 'if-client-routing' }
  },
  iKnowThePerformanceRisksOfAsyncRouteFunctions: {
    env: { server: true, client: 'if-client-routing', eager: true }
  },
  filesystemRoutingRoot: {
    env: { config: true }
  },
  client: {
    // The value of the client config is merely the file path to the client entry file, which is only needed on the sever-side
    env: { server: true },
    _valueIsFilePath: true
  },
  clientRouting: {
    // We could make it { client: false } but we don't yet because of some legacy V0.4 design code
    env: { server: true, client: true, config: true }
  },
  prerender: {
    env: { config: true }
  },
  hydrationCanBeAborted: {
    env: { client: true }
  },
  prefetchStaticAssets: {
    env: { client: true }
  },
  extends: {
    env: { config: true }
  },
  meta: {
    env: { config: true }
  },
  isClientSideRenderable: {
    env: { server: true, client: true },
    _computed: (configValueSources): boolean =>
      isConfigSet(configValueSources, 'onRenderClient') &&
      isConfigSet(configValueSources, 'Page') &&
      !!getConfigEnv(configValueSources, 'Page')?.client
  },
  onBeforeRenderEnv: {
    env: { client: true },
    _computed: (configValueSources): null | ConfigEnvInternal =>
      !isConfigSet(configValueSources, 'onBeforeRender') ? null : getConfigEnv(configValueSources, 'onBeforeRender')
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
    env: { server: true }
  },
  onBeforeRoute: {
    env: { server: true, client: 'if-client-routing', eager: true }
  },
  prerender: {
    env: { config: true }
  },
  extensions: { env: { config: true } },
  disableAutoFullBuild: { env: { config: true } },
  includeAssetsImportedByServer: { env: { config: true } },
  baseAssets: { env: { config: true } },
  baseServer: { env: { config: true } },
  redirects: { env: { server: true } },
  trailingSlash: { env: { server: true } },
  disableUrlNormalization: { env: { server: true } }
}
