export type { PageConfig }
export type { PageConfigLoaded }
export type { ConfigEnv }
export type { PageConfigData }
export type { PageConfigGlobal }
export type { PageConfigGlobalData }
export type { ConfigElement }
export type { ConfigName }

import type { ConfigName } from './Config'

/** See https://vite-plugin-ssr/meta */
type ConfigEnv = 'client-only' | 'server-only' | 'server-and-client' | '_routing-env' | 'config-only'

type ConfigElement = ConfigElementFile & {
  configEnv: ConfigEnv
  configValue?: unknown
}
type ConfigElementFile = {
  configDefinedAt: string
  configDefinedByFile: string
} & (
  | {
      plusConfigFilePath: string
      plusValueFilePath: null
      plusValueFileExport: null
    }
  | {
      plusConfigFilePath: null
      plusValueFilePath: string
      plusValueFileExport: string
    }
  | {
      plusConfigFilePath: string
      plusValueFilePath: string
      plusValueFileExport: string
    }
)

type PageConfig = PageConfigData & {
  loadPlusValueFiles: () => Promise<
    ({
      configName: string
      importFile: string
    } & (
      | {
          isPlusFile: true
          importFileExports: Record<string, unknown>
        }
      | {
          isPlusFile: false
          importValue: unknown
        }
    ))[]
  >
}
type PageConfigData = {
  pageId: string
  isErrorPage: boolean
  plusConfigFilePathAll: string[]
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
