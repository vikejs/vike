export type { PageConfig2 }
export type { PageConfigLoaded }
export type { PageConfigGlobal }
export type { c_Env }
export type { PageConfigData }

type c_Env = 'client-only' | 'server-only' | 'server-and-client' | 'routing'

type ConfigName = string
type ConfigResolved = {
  configFilePath: string
  configValue: unknown
}
type ConfigSource = {
  codeFilePath?: string
  configFilePath: string
  c_env: string
} & (
  | ConfigResolved
  | {
      codeFilePath: string
      c_env: c_Env
      loadCode?: () => Promise<Record<string, unknown>>
    }
)
type ConfigSource1 = {
  configFilePath: string
  codeFilePath?: string
  loadCode?: () => Promise<Record<string, unknown>>
  configValue?: unknown
}

type PageConfigGlobal = Record<ConfigName, ConfigResolved>
type PageConfig1 = {
  pageId2: string
  route: string | Function
  pageConfigFilePath: string
  config: Record<ConfigName, ConfigSource1>
}
type ConfigResolved1 = Omit<ConfigSource1, 'loadCode' | 'configValue'> & { configValue: unknown }
type PageConfig1Loaded = Omit<PageConfig1, 'config'> & { config: Record<ConfigName, ConfigResolved1> }

type PageConfigData = {
  pageId2: string
  routeFilesystem: null | string
  pageConfigFilePath: string
  config: Record<
    ConfigName,
    {
      configFilePath: string
      c_env: c_Env
    } & (
      | { configValue: unknown }
      | {
          codeFilePath: string
        }
    )
  >
}

type CodeFile = { configName: string; codeFilePath: string; codeFileExports: Record<string, unknown> }

// TODO: use PageConfig1 instead
type PageConfig2 = {
  pageId2: string // TODO: rename
  route: string | Function
  pageConfigFilePath: string
  configSources: Record<ConfigName, ConfigSource> // TODO: rename?
  loadCodeFiles: () => Promise<CodeFile[]>
}

type PageConfigLoaded = PageConfig2 & {
  configValues: Record<string, unknown> // TODO: rename?
}
