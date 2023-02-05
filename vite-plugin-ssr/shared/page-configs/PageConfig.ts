export type { PageConfig }
export type { PageConfigLoaded }
export type { PageConfigGlobal }
export type { c_Env }
export type { PageConfigData }
export type { ConfigName }

type c_Env = 'client-only' | 'server-only' | 'server-and-client' | 'routing'

type ConfigName =
  | 'onRenderHtml'
  | 'onRenderClient'
  | 'onBeforeRender'
  /*
  | 'onBeforeRoute'
  | 'onBeforePrerender'
  */
  | 'onPrerender'
  | 'prerender'
  | 'Page'
  | 'passToClient'
  | 'route'
  | 'iKnowThePerformanceRisksOfAsyncRouteFunctions'
  | 'hydrationCanBeAborted'
  | 'clientEntry'
  | 'clientRouting'

type PageConfigData = {
  pageId2: string // TODO: rename
  pageConfigFilePath: string
  pageConfigFilePathAll: string[]
  routeFilesystem: null | string
  configSources: Partial<
    Record<
      ConfigName,
      {
        configFilePath: string
        c_env: c_Env
        configValue?: unknown
        codeFilePath?: string
      }
    >
  >
}

type PageConfig = PageConfigData & {
  loadCodeFiles: () => Promise<
    {
      configName: string
      codeFilePath: string
      codeFileExports: Record<string, unknown>
    }[]
  >
}

type PageConfigLoaded = PageConfig & {
  configValues: Partial<Record<ConfigName, unknown>>
}

type PageConfigGlobal = Partial<
  Record<
    ConfigName,
    {
      configFilePath: string
      configValue: unknown
    }
  >
>
