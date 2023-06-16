export type { PageConfig }
export type { PageConfigLoaded }
export type { ConfigEnvPrivate }
export type { ConfigEnvPublic }
export type { PageConfigData }
export type { PageConfigGlobal }
export type { PageConfigGlobalData }
export type { ConfigElement }
export type { ConfigElementSource }
export type { ConfigNameBuiltIn }

import type { ConfigNameBuiltIn } from './Config'

type ConfigEnvPrivate =
  | 'client-only'
  | 'server-only'
  | 'server-and-client'
  | 'config-only'
  | '_routing-env-eager'
  | '_routing-env-lazy'
/** See https://vite-plugin-ssr/meta */
type ConfigEnvPublic = Exclude<ConfigEnvPrivate, '_routing-env-eager' | '_routing-env-lazy'>

type PageConfig = PageConfigData & {
  loadCodeFiles: LoadCodeFiles
}
type PageConfigData = {
  pageId: string
  isErrorPage: boolean
  routeFilesystem: null | string
  routeFilesystemDefinedBy: null | string
  configElements: Record<string, ConfigElement>
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

type ConfigElementSource =
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
type ConfigElement = {
  configEnv: ConfigEnvPrivate
  configValue?: unknown
  configValueSerialized?: string
  configDefinedAt: string
  configDefinedByFile: string
} & ConfigElementSource

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
