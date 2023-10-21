export type { PageConfigRuntime }
export type { PageConfigRuntimeLoaded }
export type { PageConfigBuildTime }
export type { ConfigEnvInternal }
export type { ConfigEnv }
export type { PageConfigGlobalRuntime }
export type { PageConfigGlobalBuildTime }
export type { ConfigSource }
export type { ConfigValue }
export type { ConfigValueImported }
export type { ConfigValues }
export type { ConfigValueSource }
export type { ConfigValueSources }
export type { DefinedAt }
export type { DefinedAtInfoNew }
// TODO: clean
export type { DefinedAtInfoFull }
export type { DefinedAtInfoFull as DefinedAtInfo }

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
/** Page config data structure available and used at build-time */
type PageConfigBuildTime = PageConfigBase & {
  configValues: ConfigValues
  configValueSources: ConfigValueSources
}

/** Page config that applies to all pages */
type PageConfigGlobalRuntime = {
  configValues: ConfigValues
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
} & ( // TODO: remove computed from sources?
  | {
      isComputed: false
      definedAtInfo: DefinedAtInfoFull
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
  definedAt: DefinedAt
}

type ConfigValues = Record<
  // configName
  string,
  ConfigValue
>

type DefinedAt =
  // Normal config values => defined by a unique source / file path
  | {
      source: DefinedAtInfoNew
      // TODO: is this really needed?
      isEffect?: true
      isComputed?: undefined
      isCumulative?: undefined
    }
  // Cumulative config values => defined at multiple sources / file paths
  | {
      isCumulative: true
      sources: DefinedAtInfoNew[]
      isEffect?: undefined
      isComputed?: undefined
    }
  // Computed config values => defined internally by Vike
  | {
      isComputed: true
      isEffect?: undefined
      isCumulative?: undefined
    }

// TODO: rename
type DefinedAtInfoNew = {
  filePathToShowToUser: string
  fileExportPath: null | string[]
}
// TODO: rename
type DefinedAtInfoFull = (
  // TODO: simplify/replace with following?
  // {
  //   filePathAbsoluteVite: string
  //   filePathAbsoluteResolved: string | null
  // }
  // TODO: rename? filePathRelativeToUserRootDir => filePathRelativeToViteRoot
  | {
      filePathRelativeToUserRootDir: string
      filePathAbsolute: string
      importPathAbsolute: null
    }
  | {
      filePathRelativeToUserRootDir: null
      filePathAbsolute: string | null
      importPathAbsolute: string
    }
) & {
  exportName?: string
  fileExportPath: null | string[]
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
