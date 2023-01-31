export type { PageConfig }
export type { PageConfigLoaded }
export type { PageConfigGlobal }
export type { c_Env }
export type { PageConfigData }

type c_Env = 'client-only' | 'server-only' | 'server-and-client' | 'routing'

type ConfigName = string

type PageConfigData = {
  pageId2: string // TODO: rename
  pageConfigFilePath: string
  routeFilesystem: null | string
  codeFilesImporter: string
  configSources: Record<
    ConfigName,
    {
      configFilePath: string
      c_env: c_Env
      configValue?: unknown
      codeFilePath?: string
    }
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
  configValues: Record<string, unknown>
}

type PageConfigGlobal = Record<
  ConfigName,
  {
    configFilePath: string
    configValue: unknown
  }
>
