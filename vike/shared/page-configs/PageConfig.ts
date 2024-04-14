export type { PageConfigRuntime }
export type { PageConfigRuntimeLoaded }
export type { PageConfigBuildTime }
export type { ConfigEnv }
export type { ConfigEnvInternal }
export type { PageConfigGlobalRuntime }
export type { PageConfigGlobalBuildTime }
export type { ConfigValue }
export type { ConfigValueClassic }
export type { ConfigValueCumulative }
export type { ConfigValueComputed }
export type { ConfigValues }
export type { ConfigValueSource }
export type { ConfigValueSources }
export type { ConfigValuesComputed }
export type { DefinedAtData }
export type { DefinedAtFile }
export type { DefinedAtFilePath }

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
  definedAtFilePath: DefinedAtFilePath
  locationId: LocationId
  /** Wether the config value is loaded at runtime, for example config.Page or config.onBeforeRender */
  valueIsImportedAtRuntime: boolean
  /** Whether the config value is a file path, for example config.client */
  valueIsFilePath?: true
  valueIsDefinedByValueFile: boolean
}
type DefinedAtFilePath = DefinedAtFile & FilePath & { fileExportName?: string }
type ConfigValueSources = Record<
  // configName
  string,
  ConfigValueSource[]
>

type ConfigValuesComputed = Record<
  // configName
  string,
  {
    configEnv: ConfigEnvInternal
    value: unknown
  }
>

type ConfigValue = ConfigValueClassic | ConfigValueCumulative | ConfigValueComputed
/** Defined by a unique source (thus unique file path). */
type ConfigValueClassic = {
  type: 'classic'
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

type ConfigValues = Record<
  // configName
  string,
  ConfigValue
>

type DefinedAtData = DefinedAtFile | DefinedAtFile[] | null
type DefinedAtFile = {
  filePathToShowToUser: string
  fileExportPathToShowToUser: null | string[]
}
