export type { PageConfigRuntime }
export type { PageConfigRuntimeLoaded }
export type { PageConfigBuildTime }
export type { ConfigEnv }
export type { ConfigEnvInternal }
export type { PageConfigGlobalRuntime }
export type { PageConfigGlobalBuildTime }
export type { ConfigValue }
export type { ConfigValues }
export type { ConfigValueSource }
export type { ConfigValueSources }
export type { ConfigValueComputed }
export type { ConfigValuesComputed }
export type { DefinedAt }
export type { DefinedAtFile }
export type { DefinedAtFileFullInfo }

import type { ConfigValueImported, ConfigValueSerialized } from './serialize/PageConfigSerialized.js'
import type { LocationId } from '../../node/plugin/plugins/importUserCode/v1-design/getVikeConfig/filesystemRouting.js'
import type { FilePath } from './FilePath.js'

type PageConfigBase = {
  pageId: string
  isErrorPage?: true
  routeFilesystem?: {
    routeString: string
    definedBy: string
  }
  configValues: ConfigValues
}

/** Page config data structure available at runtime */
type PageConfigRuntime = PageConfigBase & {
  /** Load config values that are lazily loaded such as config.Page */
  loadConfigValuesAll: () => Promise<{
    configValuesImported: ConfigValueImported[]
    configValuesSerialized: Record<string, ConfigValueSerialized>
  }>
}
/** Same as PageConfigRuntime but also contains all lazily loaded config values such as config.Page */
type PageConfigRuntimeLoaded = PageConfigRuntime & {
  /** Whether loadConfigValuesAll() was called */
  isAllLoaded: true
}

/** Page config data structure available at build-time */
type PageConfigBuildTime = PageConfigBase & {
  configValueSources: ConfigValueSources
  configValuesComputed: ConfigValuesComputed
}

/** Page config that applies to all pages */
type PageConfigGlobalRuntime = {
  configValues: ConfigValues
}
type PageConfigGlobalBuildTime = {
  configValueSources: ConfigValueSources
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
  eager?: boolean
}

type ConfigValueSource = {
  value?: unknown
  configEnv: ConfigEnvInternal
  definedAt: DefinedAtFileFullInfo
  locationId: LocationId
  /** Wether the config value is loaded at runtime, for example config.Page or config.onBeforeRender */
  valueIsImportedAtRuntime: boolean
  /** Whether the config value is a file path, for example config.client */
  valueIsFilePath?: true
  valueIsDefinedByValueFile: boolean
}
type DefinedAtFileFullInfo = DefinedAtFile & FilePath & { fileExportName?: string }
type ConfigValueSources = Record<
  // configName
  string,
  ConfigValueSource[]
>

type ConfigValueComputed = {
  configEnv: ConfigEnvInternal
  value: unknown
}
type ConfigValuesComputed = Record<
  // configName
  string,
  ConfigValueComputed
>

type ConfigValue = {
  value: unknown
  definedAt: DefinedAt
}
type DefinedAt =
  // Normal config values => defined by a unique source / file path
  | DefinedAtFile
  // Cumulative config values => defined at multiple sources / file paths
  | { files: DefinedAtFile[] }
  // Computed config values => defined internally by Vike (currently, Vike doesn't support computed configs craeted by users)
  | { isComputed: true }
type DefinedAtFile = {
  filePathToShowToUser: string
  fileExportPathToShowToUser: null | string[]
}
type ConfigValues = Record<
  // configName
  string,
  ConfigValue
>
