export type { PageConfig }
export type { PageConfigLoaded }
export type { PageConfigBuildTime }
export type { PageConfigCommon }
export type { ConfigEnvInternal }
export type { ConfigEnv }
export type { PageConfigGlobal }
export type { PageConfigGlobalData }
export type { ConfigSource }
export type { ConfigValue }
export type { ConfigValues }
export type { ConfigValueSource }
export type { ConfigValueSources }
export type { DefinedAtInfo }

type ConfigEnv = 'client-only' | 'server-only' | 'server-and-client' | 'config-only'
type ConfigEnvInternal = ConfigEnv | '_routing-eager' | '_routing-lazy'

type PageConfigBuildTime = PageConfigCommon & {
  configValueSources: ConfigValueSources
}
type PageConfigCommon = {
  pageId: string
  isErrorPage: boolean
  // TODO: unify to routeFilesystem: null | { routeString: string, definedBy: string }
  routeFilesystem: null | string
  routeFilesystemDefinedBy: null | string
  configValues: ConfigValues
}
type ConfigValueSource = {
  configEnv: ConfigEnvInternal
  valueSerialized?: string
  value?: unknown
  // For example: config.Page or config.onBeforeRender
  valueIsImportedAtRuntime: boolean
  // For config.client
  valueIsFilePath?: true
} & (
  | {
      isComputed: false
      // TODO: replace definedAtInfo.filePath with definedAtInfo.filePathRelativeToUserRootDir? and definedAtInfo.filePathAbsolute!
      definedAtInfo: DefinedAtInfo
    }
  | {
      isComputed: true
      definedAtInfo: null
      valueIsImportedAtRuntime: false
    }
)
type ConfigValueSources = Record<
  // configName
  string,
  ConfigValueSource[]
>
type ConfigValue = {
  value: unknown
  // Is null when config value is:
  //  - computed, or
  //  - cumulative
  definedAtInfo: null | DefinedAtInfo
}
type ConfigValues = Record<
  // configName
  string,
  ConfigValue
>
type DefinedAtInfo = {
  filePath: string
  fileExportPath: string[]
}

type ConfigSource = { configSourceFile: string } & (
  | { configSourceFileExportName: string; configSourceFileDefaultExportKey?: undefined }
  | { configSourceFileDefaultExportKey: string; configSourceFileExportName?: undefined }
)
type PageConfig = PageConfigCommon & {
  loadCodeFiles: LoadCodeFiles
  isLoaded?: true
}
type PageConfigLoaded = PageConfig & {
  isLoaded: true
}

type PageConfigGlobalData = {
  onPrerenderStart: null | ConfigValueSource
  onBeforeRoute: null | ConfigValueSource
}
type PageConfigGlobal = {
  onPrerenderStart: null | (ConfigValueSource & { value: unknown })
  onBeforeRoute: null | (ConfigValueSource & { value: unknown })
}

type LoadCodeFiles = () => Promise<
  ({
    configName: string
    importFilePath: string
  } & (
    | // A +{configName}.js file
    {
        isPlusFile: true // TODO: improve naming
        codeFileExports: Record<string, unknown>
      }
    // An import in +config.js
    | {
        isPlusFile: false
        // import { exportName as exportAlias } from './importFilePathRelative.js'
        importFileExportName: string
        importFileExportAlias: unknown
      }
  ))[]
>
