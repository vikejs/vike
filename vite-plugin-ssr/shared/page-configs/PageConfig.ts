export type { PageConfig2 }
export type { PageConfigLoaded }
export type { c_Env }

type c_Env = 'client-only' | 'server-only' | 'server-and-client' | 'config' | 'routing'

type ConfigName = string
type ConfigSource =
  | {
      configFilePath: string
      configValue: unknown
    }
  | {
      codeFilePath: string
      c_env: c_Env
      loadCode?: () => Promise<Record<string, unknown>>
    }

// TODO: rename
type PageConfig2 = {
  pageId2: string
  route: string | Function
  pageConfigFilePath?: string
  configSources: Record<ConfigName, ConfigSource> // TODO: rename?
}

type PageConfigLoaded = PageConfig2 & {
  configValues: Record<string, unknown> // TODO: rename?
}
