export type { PageConfig2 }
export type { PageConfigLoaded }
export type { PageConfigGlobal }
export type { c_Env }
export type { PageConfigData }

type c_Env = 'client-only' | 'server-only' | 'server-and-client' | 'routing'

type ConfigName = string

type PageConfigGlobal = Record<
  ConfigName,
  {
    configFilePath: string
    configValue: unknown
  }
>

type ConfigSource = {
  configFilePath: string
  c_env: c_Env
  configValue?: unknown
  codeFilePath?: string
}

type PageConfigData = {
  pageId2: string
  codeFilesImporter: string
  routeFilesystem: null | string
  pageConfigFilePath: string
  configSources: Record<ConfigName, ConfigSource>
}

type CodeFile = { configName: string; codeFilePath: string; codeFileExports: Record<string, unknown> }

// TODO: rename
type PageConfig2 = {
  pageId2: string // TODO: rename
  pageConfigFilePath: string
  routeFilesystem: null | string
  codeFilesImporter: string
  configSources: Record<ConfigName, ConfigSource>
  loadCodeFiles: () => Promise<CodeFile[]>
}

type PageConfigLoaded = PageConfig2 & {
  configValues: Record<string, unknown> // TODO: rename?
}
