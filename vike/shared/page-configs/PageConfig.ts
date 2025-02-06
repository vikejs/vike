export type { PageConfigRuntime }
export type { PageConfigRuntimeLoaded }
export type { PageConfigBuildTime }
export type { ConfigEnv }
export type { ConfigEnvInternal }
export type { PageConfigGlobalRuntime }
export type { PageConfigGlobalBuildTime }
export type { ConfigValue }
export type { ConfigValueStandard }
export type { ConfigValueCumulative }
export type { ConfigValueComputed }
export type { ConfigValues }
export type { ConfigValueSource }
export type { ConfigValueSources }
export type { ConfigValuesComputed }
export type { DefinedAtData }
export type { DefinedAtFile }
export type { DefinedAtFilePath }

import type { ConfigValueSerialized } from './serialize/PageConfigSerialized.js'
import type { LocationId } from '../../node/plugin/plugins/importUserCode/v1-design/getVikeConfig/filesystemRouting.js'
import type { FilePath } from './FilePath.js'
import type { ConfigDefinitions } from '../../node/plugin/plugins/importUserCode/v1-design/getVikeConfig/configDefinitionsBuiltIn.js'
import type {
  InterfaceFile,
  InterfaceFilesByLocationId
} from '../../node/plugin/plugins/importUserCode/v1-design/getVikeConfig.js'

type PageConfigCommon = {
  pageId: string
  isErrorPage?: true
  routeFilesystem?: {
    routeString: string
    definedBy: string
  }
}

// `*Runtime` VS `*BuildTime`:
// - `*BuildTime` data structures aim to collect as much information as possible.
// - `*Runtime` data structures aim to be as minimal and lightweight as possible,  in order to save client-side KBs.

/** Page config, runtime data structure */
type PageConfigRuntime = PageConfigCommon & {
  configValues: ConfigValues
  /** Load config values that are lazily loaded such as config.Page */
  loadConfigValuesAll: LoadConfigValuesAll
}
/** Global config that applies to all pages, runtime data structure */
type PageConfigGlobalRuntime = {
  configValues: ConfigValues
}

/** Page config, build-time data structure */
type PageConfigBuildTime = PageConfigCommon & {
  configDefinitions: ConfigDefinitions
  interfaceFiles: InterfaceFilesByLocationId
  configValueSources: ConfigValueSources
  configValuesComputed: ConfigValuesComputed
}
/** Global config that applies to all pages, build-time data structure */
type PageConfigGlobalBuildTime = {
  configValueSources: ConfigValueSources
  configDefinitions: ConfigDefinitions
  configValuesComputed?: undefined
}

/** Same as PageConfigRuntime but also contains all lazily loaded config values such as config.Page */
type PageConfigRuntimeLoaded = PageConfigRuntime & {
  /** Whether loadConfigValuesAll() was called */
  isAllLoaded: true
}
type LoadConfigValuesAll = () => {
  moduleId: string
  moduleExports: Promise<{
    configValuesSerialized: Record<string, ConfigValueSerialized>
  }>
}

/** In what environment(s) the config value is loaded.
 *
 * https://vike.dev/meta
 */
type ConfigEnv = {
  client?: boolean
  server?: boolean
  config?: boolean
}
/** For Vike internal use */
type ConfigEnvInternal = Omit<ConfigEnv, 'client'> & {
  client?: boolean | 'if-client-routing'
  /** Load value only in production, or only in development. */
  production?: boolean
}

type ConfigValueSources = Record<
  string, // configName
  ConfigValueSource[]
>
type ConfigValueSource = {
  value?: unknown
  configEnv: ConfigEnvInternal
  definedAtFilePath: DefinedAtFilePath
  interfaceFile:
    | InterfaceFile
    // It's `null` when the config is defined by `vike(options)` in vite.config.js
    // TODO/v1-release: remove `null`
    | null
  // TODO/v1-release: remove `locationId` in favor of `interfaceFile.locationId`
  locationId: LocationId
  isOverriden: boolean
  /** Wether the config value is loaded at runtime, for example config.Page or config.onBeforeRender */
  valueIsImportedAtRuntime: boolean
  /** Whether the config value is a file path, for example config.client */
  valueIsFilePath?: true
  valueIsDefinedByPlusFile: boolean
}
type DefinedAtFilePath = DefinedAtFile & FilePath & { fileExportName?: string }

type ConfigValuesComputed = Record<
  string, // configName
  {
    configEnv: ConfigEnvInternal
    value: unknown
  }
>

type ConfigValues = Record<
  string, // configName
  ConfigValue
>
type ConfigValue = ConfigValueStandard | ConfigValueCumulative | ConfigValueComputed
/** Defined by a unique source (thus unique file path). */
type ConfigValueStandard = {
  type: 'standard'
  value: unknown
  definedAtData: DefinedAtFile
}
/** Defined by multiple sources (thus multiple file paths). */
type ConfigValueCumulative = {
  type: 'cumulative'
  value: unknown[]
  definedAtData: DefinedAtFile[]
}
/** Defined internally by Vike (currently, Vike doesn't support computed configs created by users). */
type ConfigValueComputed = {
  type: 'computed'
  value: unknown
  definedAtData: null
}

type DefinedAtData = DefinedAtFile | DefinedAtFile[] | null
type DefinedAtFile = {
  filePathToShowToUser: string
  fileExportPathToShowToUser: null | string[]
}
