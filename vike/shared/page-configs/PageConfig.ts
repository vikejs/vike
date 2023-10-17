export type { PageConfigRuntime }
export type { PageConfigRuntimeLoaded }
export type { PageConfigRuntimeSerialized }
export type { PageConfigBuildTime }
export type { ConfigEnvInternal }
export type { ConfigEnv }
export type { PageConfigGlobalRuntime }
export type { PageConfigGlobalRuntimeSerialized }
export type { PageConfigGlobalBuildTime }
export type { ConfigSource }
export type { ConfigValue }
export type { ConfigValueSerialized }
export type { ConfigValueImported }
export type { ConfigValues }
export type { ConfigValueSource }
export type { ConfigValueSources }
export type { DefinedAtInfo }
export type { DefinedAtInfoFull }

type PageConfigBase = {
  pageId: string
  isErrorPage?: true
  routeFilesystem?: {
    routeString: string
    definedBy: string
  }
}
/** Page config data structure available and used at runtime */
type PageConfigRuntime = PageConfigBase & {
  /** Loaded config values */
  configValues: ConfigValues
  /** Load config values that are lazily loaded such as config.Page */
  loadConfigValuesAll: LoadConfigValuesAll
}
/** Same as PageConfigRuntime but also contains all lazily loaded config values such as config.Page */
type PageConfigRuntimeLoaded = PageConfigRuntime & {
  /** Whether loadConfigValuesAll() was called */
  isLoaded: true
}
/** page config data structure available and used at build-time */
type PageConfigBuildTime = PageConfigBase & {
  configValues: ConfigValues
  configValueSources: ConfigValueSources
}
/** page config data structure serialized in virtual files: parsing it results in PageConfigRuntime */
type PageConfigRuntimeSerialized = PageConfigBase & {
  /** Config values that are loaded eagerly and serializable such as config.passToClient */
  configValuesSerialized: Record<string, ConfigValueSerialized>
  /** Config values imported eagerly such as config.route */
  configValuesImported: ConfigValueImported[]
  /** Config values imported lazily such as config.page */
  loadConfigValuesAll: LoadConfigValuesAll
}

/** page config that applies to all pages */
type PageConfigGlobalRuntime = {
  configValues: ConfigValues
}
type PageConfigGlobalRuntimeSerialized = {
  configValuesImported: ConfigValueImported[]
}
type PageConfigGlobalBuildTime = {
  configValueSources: ConfigValueSources
}

type ConfigEnv = 'client-only' | 'server-only' | 'server-and-client' | 'config-only'
/** For Vike internal use */
type ConfigEnvInternal = ConfigEnv | '_routing-eager' | '_routing-lazy'
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
  // Is null when config value is:
  //  - computed, or
  //  - cumulative
  // TODO: replace with filePathToShowToUser
  definedAtInfo: null | DefinedAtInfo
}
type ConfigValueSerialized = {
  valueSerialized: string
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
type DefinedAtInfoFull = {
  filePathRelativeToUserRootDir?: string
  filePathAbsolute: string
  fileExportPath: string[]
}

type ConfigSource = { configSourceFile: string } & (
  | { configSourceFileExportName: string; configSourceFileDefaultExportKey?: undefined }
  | { configSourceFileDefaultExportKey: string; configSourceFileExportName?: undefined }
)

type LoadConfigValuesAll = () => Promise<ConfigValueImported[]>
type ConfigValueImported = {
  configName: string
  // TODO: rename?
  importPath: string
} & (
  | {
      isValueFile: true // importPath is a +{configName}.js file
      // TODO: rename?
      importFileExports: Record<string, unknown>
    }
  | {
      isValueFile: false // importPath is imported by a +config.js file
      // TODO: rename?
      // import { something } from './importPathRelative.js'
      // -> exportName === 'something'
      // -> importFileExportValue holds the value of `something`
      exportName: string
      importFileExportValue: unknown
    }
)
