export { configDefinitionsBuiltIn }
export type { ConfigDefinition }
export type { ConfigDefinitions }
export type { ConfigDefinitionsInternal }
export type { ConfigDefinitionInternal }
export type { ConfigEffect }

import type {
  ConfigEnvInternal,
  ConfigEnv,
  ConfigValueSources,
  DefinedAtFilePath,
  ConfigValueSource,
} from '../../../../types/PageConfig.js'
import type { Config, ConfigNameBuiltIn, ConfigNameGlobal } from '../../../../types/Config.js'
import { assert, assertUsage } from '../../utils.js'
import { getConfigDefinedAt, type ConfigDefinedAt } from '../../../../shared/page-configs/getConfigDefinedAt.js'

// For users
/** The meta definition of a config.
 *
 * https://vike.dev/meta
 */
type ConfigDefinition = ConfigDefinition_ | ConfigDefinitionDefinedByPeerDependency
type ConfigDefinition_ = {
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
   * Function called when the config value is defined.
   *
   * https://vike.dev/meta
   */
  effect?: ConfigEffect
  /**
   * Always load the configuration value, and as soon as possible.
   *
   * @default false
   *
   * https://vike.dev/meta
   */
  eager?: boolean
  /**
   * Whether the configuration always applies to all pages (no config inheritance).
   *
   * @default false
   *
   * https://vike.dev/extends#inheritance
   */
  global?: boolean | ((value: unknown, moreInfo: { isGlobalLocation: boolean }) => boolean)
}
type ConfigDefinitionDefinedByPeerDependency = {
  /**
   * Omit the "unknown config" error without defining the config — useful for optional peer dependencies: for example, vike-server sets +stream.require which is defined by vike-{react,vue,solid} but some users don't use vike-{react,vue,solid}
   */
  isDefinedByPeerDependency: true
}

/**
 * Function called when the config value is defined.
 *
 * https://vike.dev/meta
 */
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
  configDefinedAt: ConfigDefinedAt
}) => Config | undefined

/** For Vike internal use */
type ConfigDefinitionInternal = Omit<ConfigDefinition_, 'env'> & {
  _computed?: (configValueSources: ConfigValueSources) => unknown
  _valueIsFilePath?: true
  _userEffectDefinedAtFilePath?: DefinedAtFilePath
  env: ConfigEnvInternal
}

type ConfigDefinitions = Record<
  string, // configName
  ConfigDefinition
>
type ConfigDefinitionsInternal = Record<
  string, // configName
  ConfigDefinitionInternal
>
type ConfigDefinitionsBuiltIn = Record<ConfigNameBuiltIn | ConfigNameGlobal, ConfigDefinitionInternal>
const configDefinitionsBuiltIn: ConfigDefinitionsBuiltIn = {
  onRenderHtml: {
    env: { server: true },
  },
  onRenderClient: {
    env: { client: true },
  },
  onHydrationEnd: {
    env: { client: true },
  },
  onPageTransitionStart: {
    env: { client: true },
  },
  onPageTransitionEnd: {
    env: { client: true },
  },
  onCreatePageContext: {
    env: { server: true, client: true },
    cumulative: true,
  },
  onCreateGlobalContext: {
    env: { server: true, client: true },
    global: true,
    cumulative: true,
  },
  onBeforeRender: {
    env: { server: true },
  },
  onBeforePrerenderStart: {
    env: { server: true, production: true },
  },
  Page: {
    env: { server: true, client: true },
  },
  passToClient: {
    env: { server: true },
    cumulative: true,
  },
  route: {
    env: {
      server: true,
      client: 'if-client-routing',
      // For vite-plugin-vercel
      config: true,
    },
    eager: true,
  },
  guard: {
    env: { server: true, client: 'if-client-routing' },
  },
  data: {
    env: { server: true },
  },
  onData: {
    env: { server: true, client: true },
    cumulative: true,
  },
  iKnowThePerformanceRisksOfAsyncRouteFunctions: {
    env: { server: true, client: 'if-client-routing' },
    eager: true,
  },
  filesystemRoutingRoot: {
    env: { config: true },
  },
  client: {
    // The value of the client config is merely the file path to the client entry file, which is only needed on the sever-side
    env: { server: true, config: true },
    _valueIsFilePath: true,
  },
  clientRouting: {
    // We could make it { client: false } but we don't yet because of some legacy V0.4 design code
    env: { server: true, client: true, config: true },
    eager: true,
  },
  clientHooks: {
    env: { config: true },
  },
  hydrationCanBeAborted: {
    env: { client: true },
  },
  prefetch: {
    env: { client: true },
    eager: true,
  },
  // TO-DO/next-major-release: remove
  prefetchStaticAssets: {
    env: { client: true },
  },
  extends: {
    env: { config: true },
  },
  meta: {
    env: { config: true },
  },
  // Whether the page loads:
  //  - Vike's client runtime
  //  - User's client hooks
  // In other words, whether the page is "HTML-only" (https://vike.dev/render-modes). HTML-only pages shouldn't load the client runtime nor client hooks.
  isClientRuntimeLoaded: {
    env: { server: true, client: true },
    eager: true,
    _computed: (configValueSources): boolean => {
      {
        const source = getConfigValueSource(configValueSources, 'clientHooks')
        if (source) {
          assert(source.valueIsLoaded)
          if (source.value !== null) {
            const { value } = source
            const definedAt = getConfigDefinedAt('Config', 'clientHooks', source.definedAt)
            assertUsage(typeof value === 'boolean', `${definedAt} should be a boolean`)
            return value
          }
        }
      }
      return (
        isConfigSet(configValueSources, 'onRenderClient') &&
        isConfigSet(configValueSources, 'Page') &&
        !!getConfigEnv(configValueSources, 'Page')?.client
      )
    },
  },
  onBeforeRenderEnv: {
    env: { client: true },
    eager: true,
    _computed: (configValueSources): null | ConfigEnvInternal =>
      !isConfigSet(configValueSources, 'onBeforeRender') ? null : getConfigEnv(configValueSources, 'onBeforeRender'),
  },
  dataEnv: {
    env: { client: true },
    eager: true,
    _computed: (configValueSources): null | ConfigEnvInternal =>
      !isConfigSet(configValueSources, 'data') ? null : getConfigEnv(configValueSources, 'data'),
  },
  hooksTimeout: {
    env: { server: true, client: true },
  },
  cacheControl: {
    env: { server: true },
  },
  host: {
    env: { config: true },
    global: true,
  },
  port: {
    env: { config: true },
    global: true,
  },
  mode: {
    env: { config: true },
    global: true,
  },
  injectScriptsAt: {
    env: { server: true },
  },
  name: {
    env: { config: true },
  },
  require: {
    env: { config: true },
  },
  keepScrollPosition: {
    env: { client: true },
  },
  middleware: { env: { server: true }, cumulative: true, eager: true, global: true },
  onPrerenderStart: {
    env: { server: true, production: true },
    eager: true,
    global: true,
  },
  onBeforeRoute: {
    env: { server: true, client: 'if-client-routing' },
    eager: true,
    global: true,
  },
  prerender: {
    env: { config: true },
    global: (value, { isGlobalLocation }) => typeof value === 'object' || isGlobalLocation,
    cumulative: true,
  },
  vite: { env: { config: true }, global: true, cumulative: true },
  disableAutoFullBuild: {
    env: { config: true },
    global: true,
  },
  vite6BuilderApp: {
    env: { config: true },
    global: true,
  },
  includeAssetsImportedByServer: {
    env: { config: true },
    global: true,
  },
  baseAssets: {
    env: { config: true, server: true },
    global: true,
  },
  baseServer: {
    env: { config: true, server: true },
    global: true,
  },
  redirects: {
    env: { server: true },
    global: true,
    cumulative: true,
  },
  trailingSlash: {
    env: { server: true },
    global: true,
  },
  disableUrlNormalization: {
    env: { server: true },
    global: true,
  },
  headersResponse: {
    env: { server: true },
    cumulative: true,
  },
}

function getConfigEnv(configValueSources: ConfigValueSources, configName: string): null | ConfigEnvInternal {
  const configValueSource = getConfigValueSource(configValueSources, configName)
  if (!configValueSource) return null
  const { configEnv } = configValueSource
  const env: { client?: true; server?: true } = {}
  if (configEnv.client) env.client = true
  if (configEnv.server) env.server = true
  return env
}
function isConfigSet(configValueSources: ConfigValueSources, configName: string): boolean {
  const source = getConfigValueSource(configValueSources, configName)
  return (
    !!source &&
    !(
      source.valueIsLoaded &&
      // Enable users to suppress inherited config by overriding it with `null`
      source.value === null
    )
  )
}
function getConfigValueSource(configValueSources: ConfigValueSources, configName: string): null | ConfigValueSource {
  const sources = configValueSources[configName]
  if (!sources) return null
  const configValueSource = sources[0]
  assert(configValueSource)
  return configValueSource
}
