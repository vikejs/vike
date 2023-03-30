export type { PageConfig }
export type { PageConfigLoaded }
export type { ConfigEnv }
export type { PageConfigData }
export type { PageConfigGlobal }
export type { PageConfigGlobalData }
export type { ConfigName }
export type { ConfigElement }

type ConfigEnv = 'client-only' | 'server-only' | 'server-and-client' | '_routing-env' | 'config-only'

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
// TODO: remove/consolidate configElem/configDefinedAtFile
type ConfigElementFile = {
  configElem: string
  configDefinedAtFile: string
} & (
  | {
      configFilePath2: string
      codeFilePath2: null
      codeFileExport2: null
    }
  | {
      configFilePath2: null
      codeFilePath2: string
      codeFileExport2: string
    }
  | {
      configFilePath2: string
      codeFilePath2: string
      codeFileExport2: string
    }
)

type ConfigElement = ConfigElementFile & {
  configEnv: ConfigEnv
  configValue?: unknown
}

type PageConfigData = {
  pageId2: string // TODO: rename
  isErrorPage: boolean
  pageConfigFilePathAll: string[]
  routeFilesystem: null | string
  routeFilesystemDefinedBy: string
  configElements: Partial<Record<ConfigName, ConfigElement>>
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
  onPrerenderStart: null | ConfigElement
  onBeforeRoute: null | ConfigElement
}
type PageConfigGlobal = {
  onPrerenderStart: null | (ConfigElement & { configValue: unknown })
  onBeforeRoute: null | (ConfigElement & { configValue: unknown })
}
