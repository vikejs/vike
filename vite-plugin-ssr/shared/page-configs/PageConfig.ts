export type { PageConfig }
export type { PageConfigLoaded }
export type { ConfigValueEnv }
export type { PageConfigData }
export type { PageConfigGlobal }
export type { PageConfigGlobalData }
export type { ConfigName }
export type { ConfigSource }

type ConfigValueEnv = 'client-only' | 'server-only' | 'server-and-client' | '_routing-env' | 'config-only'

type ConfigName =
  | 'onRenderHtml'
  | 'onRenderClient'
  | 'onBeforeRender'
  | 'onBeforePrerenderStart'
  | 'onHydrationEnd'
  | 'onPageTransitionStart'
  | 'onPageTransitionEnd'
  | 'prerender'
  | 'Page'
  | 'passToClient'
  | 'route'
  | 'iKnowThePerformanceRisksOfAsyncRouteFunctions'
  | 'isErrorPage'
  | 'hydrationCanBeAborted'
  | 'clientEntry'
  | 'clientRouting'

// TODO: rename configFilePath2 => configValueFilePath
// TODO: remove/consolidate configSrc/configDefinedAtFile
type ConfigSoureFile = {
  configSrc: string
  configDefinedAtFile: string
} & (
  | {
      configFilePath2: string
      codeFilePath2: null
    }
  | {
      configFilePath2: null
      codeFilePath2: string
    }
  | {
      configFilePath2: string
      codeFilePath2: string
    }
)

type ConfigSource = ConfigSoureFile & {
  configEnv: ConfigValueEnv
  configValue?: unknown
}

type PageConfigData = {
  pageId2: string // TODO: rename
  isErrorPage: boolean
  pageConfigFilePathAll: string[]
  routeFilesystem: null | string
  routeFilesystemDefinedBy: string
  configSources: Partial<Record<ConfigName, ConfigSource>>
}

type PageConfig = PageConfigData & {
  loadCodeFiles: () => Promise<
    {
      configName: string
      codeFilePath3: string
      codeFileExports: Record<string, unknown>
    }[]
  >
}

type PageConfigLoaded = PageConfig & {
  configValues: Partial<Record<ConfigName, unknown>>
}

type PageConfigGlobalData = {
  onPrerenderStart: null | ConfigSource
  onBeforeRoute: null | ConfigSource
}
type PageConfigGlobal = {
  onPrerenderStart: null | (ConfigSource & { configValue: unknown })
  onBeforeRoute: null | (ConfigSource & { configValue: unknown })
}
