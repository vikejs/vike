export type { PageConfig }
export type { PageConfigLoaded }
export type { ConfigEnvPrivate }
export type { ConfigEnvPublic }
export type { PageConfigData }
export type { PageConfigGlobal }
export type { PageConfigGlobalData }
export type { ConfigElement }
export type { ConfigElementSource }
export type { ConfigSource }
export type { ConfigValue }
export type { ConfigValues }
export type { ConfigValueSource }
export type { ConfigValueSources }

type ConfigEnvPrivate =
  | 'client-only'
  | 'server-only'
  | 'server-and-client'
  | 'config-only'
  | '_routing-eager'
  | '_routing-lazy'
/** The environments in which the configuration value is loaded.
 *
 * https://vite-plugin-ssr/meta
 */
type ConfigEnvPublic = Exclude<ConfigEnvPrivate, '_routing-eager' | '_routing-lazy'>

type ConfigName = string

type PageConfigData = {
  pageId: string
  isErrorPage: boolean
  routeFilesystem: null | string
  routeFilesystemDefinedBy: null | string
  configValueSources: ConfigValueSources
  configValues: ConfigValues
  // TODO: remove in favor of configValueSources
  configElements: Record<ConfigName, ConfigElement>
}
type ConfigValueSource = {
  configEnv: ConfigEnvPrivate
  valueSerialized?: string
  value?: unknown
  definedAt: DefinedAt
  isCodeEntry: boolean
}
type ConfigValueSources = Record<
  // configName
  string,
  ConfigValueSource[]
>
type ConfigValue = {
  value: unknown
  // isDefinedByCodeFile: boolean
  definedAt: DefinedAt
}
type ConfigValues = Record<
  // configName
  string,
  ConfigValue
>
type DefinedAt = {
  filePath: string
  fileExportPath: string[]
}

type ConfigSource = { configSourceFile: string } & (
  | { configSourceFileExportName: string; configSourceFileDefaultExportKey?: undefined }
  | { configSourceFileDefaultExportKey: string; configSourceFileExportName?: undefined }
)
type PageConfig = PageConfigData & {
  loadCodeFiles: LoadCodeFiles
  isLoaded?: true
}
type PageConfigLoaded = PageConfig & {
  isLoaded: true
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
        codeFileExportName: string
      }
  ))[]
>
