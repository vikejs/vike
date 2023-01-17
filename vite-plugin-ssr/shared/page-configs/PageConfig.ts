export type { PageConfig2 }
export type { PageConfigLoaded }
export type { CodeEnv }
export type { ConfigSource }

type CodeEnv = 'client-only' | 'server-only' | 'server-and-client'

type ConfigName = string
type ConfigSource =
  | {
      configFilePath: string
      configValue: unknown
    }
  | {
      codeFilePath: string
      codeEnv: CodeEnv
      loadCodeFile?: () => Promise<Record<string, unknown>>
    }

// TODO: rename
type PageConfig2 = {
  pageId2: string
  route: string
  configSources: Record<ConfigName, ConfigSource> // TODO: rename?
}

type PageConfigLoaded = PageConfig2 & {
  configValues: Record<string, unknown> // TODO: rename?
}
