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
    }
)

type PageConfigGlobal = Record<ConfigName, ConfigResolved>

type PageConfigData = {
  pageId2: string
  codeFilesImporter: string
  routeFilesystem: null | string
  pageConfigFilePath: string
  configSources: Record<
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
  codeFilesImporter: string
  route: string | Function
  pageConfigFilePath: string
  configSources: Record<ConfigName, ConfigSource> // TODO: rename?
  loadCodeFiles: () => Promise<CodeFile[]>
}

type PageConfigLoaded = PageConfig2 & {
  configValues: Record<string, unknown> // TODO: rename?
}
