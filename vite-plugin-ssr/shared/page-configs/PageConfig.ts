export type { PlusConfig }
export type { PlusConfigLoaded }
export type { ConfigEnv }
export type { PlusConfigData }
export type { PlusConfigGlobal }
export type { PlusConfigGlobalData }
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

type PlusConfig = PlusConfigData & {
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
type PlusConfigData = {
  pageId: string
  isErrorPage: boolean
  plusConfigFilePathAll: string[]
  routeFilesystem: null | string
  routeFilesystemDefinedBy: string
  configElements: Partial<Record<ConfigName, ConfigElement>>
}
type PlusConfigLoaded = PlusConfig & {
  configValues: Partial<Record<ConfigName, unknown>>
}

type PlusConfigGlobalData = {
  onPrerenderStart: null | ConfigElement
  onBeforeRoute: null | ConfigElement
}
type PlusConfigGlobal = {
  onPrerenderStart: null | (ConfigElement & { configValue: unknown })
  onBeforeRoute: null | (ConfigElement & { configValue: unknown })
}
