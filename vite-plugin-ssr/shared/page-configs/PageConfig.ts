// export type { PageConfig }
export type { PageConfigFile }
export type { PageConfigValues }
export type { CodeExport } // TODO: rename
export type { PageConfigInfo }

export type { CodeEnv }
export type { PageConfigLoaded }
export type { PageConfig2 }

// TODO: remove
type CodeExport = {
  codeExportName: string
  codeExportValue: unknown
  codeExportFilePath: string
}
// TODO: remove
type PageConfig = PageConfigInfo & {
  loadCode: () => Promise<void>
  codeExports: null | CodeExport[]
}

type CodeEnv = 'client-only' | 'server-only' | 'server-and-client'

type ConfigName = string
type ConfigSource = {
  configFilePath: string
  configValue: unknown
  /* Not needed I guess?
  configFilePath: string
  codeFilePath: string
  */
} | ({
  codeFilePath: string,
  codeEnv: CodeEnv
} & ({
  isLoadable: true,
  loadCodeFile:() => Promise<Record<string, unknown>>
} | {
  codeFilePath: string,
  isLoadable: false
}))

// TODO: rename
type PageConfig2 = {
  pageId2: string
  route: string
  configSources: Record<ConfigName, ConfigSource> // TODO: rename?
}

type PageConfigLoaded = PageConfig2 & {
  configValues: Record<string, unknown> // TODO: rename?
}

type PageConfigRequired = 'onRenderClient' | 'onRenderHtml' | 'route'
type PageConfigInfo = Omit<PageConfigValues, PageConfigRequired> &
  Required<Pick<PageConfigValues, PageConfigRequired>> & {
    pageId2: string
    pageConfigFiles: PageConfigFile[]
  }

type PageConfigValues = {
  //*
  onRenderClient?: string
  onRenderHtml?: string
  onBeforeRoute?: Function
  onBeforeRender?: Function
  passToClient?: string[]
  clientRouting?: boolean
  clientEntry?: string
  Page?: string
  route?: string | Function
  iKnowThePerformanceRisksOfAsyncRouteFunctions?: boolean
  //*/
} & Record<string, unknown> // TODO: remove all above

type PageConfigFile = {
  pageConfigFilePath: string
  pageConfigValues: PageConfigValues
}
