export type { PageConfig }
export type { PageConfigLoaded }
export type { ConfigEnv }
export type { PageConfigData }
export type { PageConfigGlobal }
export type { PageConfigGlobalData }
export type { ConfigElement }
export type { ConfigNameBuiltIn }

import type { ConfigNameBuiltIn } from './Config'

/** See https://vite-plugin-ssr/meta */
type ConfigEnv = 'client-only' | 'server-only' | 'server-and-client' | '_routing-env' | 'config-only'

type PageConfig = PageConfigData & {
  loadCodeFiles: LoadCodeFiles
}
type PageConfigData = {
  pageId: string
  isErrorPage: boolean
  plusConfigFilePathAll: string[]
  routeFilesystem: null | string
  routeFilesystemDefinedBy: string
  configElements: Partial<Record<ConfigNameBuiltIn, ConfigElement>>
}
type PageConfigLoaded = PageConfig & {
  configValues: Partial<Record<ConfigNameBuiltIn, unknown>>
}

type PageConfigGlobalData = {
  onPrerenderStart: null | ConfigElement
  onBeforeRoute: null | ConfigElement
}
type PageConfigGlobal = {
  onPrerenderStart: null | (ConfigElement & { configValue: unknown })
  onBeforeRoute: null | (ConfigElement & { configValue: unknown })
}

type ConfigElement = {
  configEnv: ConfigEnv
  configValue?: unknown
  configValueSerialized?: string
  configDefinedAt: string
  configDefinedByFile: string
} & (
  | // Defined directly in +config.js
  {
      plusConfigFilePath: string
      codeFilePath: null
      codeFileExport: null
    }
  // Defined by a + value file
  | {
      plusConfigFilePath: null
      codeFilePath: string
      codeFileExport: string
    }
  // Defined by an import in +config.js
  | {
      plusConfigFilePath: string
      codeFilePath: string
      codeFileExport: string
    }
)

type LoadCodeFiles = () => Promise<
  ({
    configName: string
    codeFilePath: string
  } & (
    | // Defined by a + value file
    {
        isPlusFile: true
        codeFileExports: Record<string, unknown>
      }
    // Defined by an import in +config.js
    | {
        isPlusFile: false
        codeFileExportValue: unknown
      }
  ))[]
>
