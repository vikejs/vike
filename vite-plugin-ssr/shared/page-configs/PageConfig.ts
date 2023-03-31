export type { PageConfig }
export type { PageConfigLoaded }
export type { ConfigEnv }
export type { PageConfigData }
export type { PageConfigGlobal }
export type { PageConfigGlobalData }
export type { ConfigName }
export type { ConfigElement }

/** See https://vite-plugin-ssr/meta */
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

type ConfigElement = ConfigElementFile & {
  configEnv: ConfigEnv
  configValue?: unknown
}
type ConfigElementFile = {
  configDefinedAt: string
  configDefinedByFile: string
} & (
  | {
      pageConfigFilePath: string
      configValueFilePath: null
      configValueFileExport: null
    }
  | {
      pageConfigFilePath: null
      configValueFilePath: string
      configValueFileExport: string
    }
  | {
      pageConfigFilePath: string
      configValueFilePath: string
      configValueFileExport: string
    }
)

type PageConfig = PageConfigData & {
  loadConfigValueFiles: () => Promise<
    {
      configName: string
      filePath: string
      fileExports: Record<string, unknown>
    }[]
  >
}
type PageConfigData = {
  pageId: string
  isErrorPage: boolean
  pageConfigFilePathAll: string[]
  routeFilesystem: null | string
  routeFilesystemDefinedBy: string
  configElements: Partial<Record<ConfigName, ConfigElement>>
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
