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
export type { ConfigValueSerialized }
export type { ConfigValueImported }
export type { ConfigValues }
export type { ConfigValueSource }
export type { ConfigValueSources }
export type { DefinedAtInfo }
export type { DefinedAtInfoFull }

type ConfigEnv = 'client-only' | 'server-only' | 'server-and-client' | 'config-only'
type ConfigEnvInternal = ConfigEnv | '_routing-eager' | '_routing-lazy'

type PageConfigBuildTime = PageConfigCommon & {
  configValueSources: ConfigValueSources
}
type PageConfigCommon = {
  pageId: string
  isErrorPage: boolean
  routeFilesystem: null | {
    routeString: string
    definedBy: string
  }
  configValues: ConfigValues
}
type ConfigValueSource = {
  configEnv: ConfigEnvInternal
  value?: unknown
  // For example: config.Page or config.onBeforeRender
  valueIsImportedAtRuntime: boolean
  // For config.client
  valueIsFilePath?: true
} & (
  | {
      isComputed: false
      definedAtInfo: DefinedAtInfo
      /* TODO: use it
      definedAtInfo: DefinedAtInfoFull
      */
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
  valueSerialized?: string
  // Is null when config value is:
  //  - computed, or
  //  - cumulative
  definedAtInfo: null | DefinedAtInfo
}
type ConfigValueSerialized = Omit<ConfigValue, 'valueSerialized' | 'value'> & { valueSerialized: string }

type ConfigValues = Record<
  // configName
  string,
  ConfigValue
>
type DefinedAtInfo = {
  filePath: string
  fileExportPath: string[]
}
type DefinedAtInfoFull = {
  filePathRelativeToUserRootDir?: string
  filePathAbsolute: string
  fileExportPath: string[]
}

type ConfigSource = { configSourceFile: string } & (
  | { configSourceFileExportName: string; configSourceFileDefaultExportKey?: undefined }
  | { configSourceFileDefaultExportKey: string; configSourceFileExportName?: undefined }
)
type PageConfig = PageConfigCommon & {
  /** Config values loaded/imported eagerly */
  configValuesImported: ConfigValueImported[]
  /** Config values loaded/imported lazily */
  loadConfigValuesAll: LoadConfigValuesAll
  /** Whether loadConfigValuesAll() was already called */
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

type LoadConfigValuesAll = () => Promise<ConfigValueImported[]>
type ConfigValueImported = {
  configName: string
  // TODO: rename?
  importFilePath: string
} & (
  | {
      isValueFile: true // importFilePath is a +{configName}.js file
      // TODO: rename?
      importFileExports: Record<string, unknown>
    }
  | {
      isValueFile: false // importFilePath is imported by a +config.js file
      // TODO: rename?
      // import { something } from './importFilePathRelative.js'
      // -> exportName === 'something'
      // -> importFileExportValue holds the value of `something`
      exportName: string
      importFileExportValue: unknown
    }
)
