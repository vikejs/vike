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
export type { DefinedAt }
export type { DefinedAtInfoNew }
// TODO: clean
export type { DefinedAtInfoFull }
export type { DefinedAtInfoFull as DefinedAtInfo }

import type { ConfigValueImported } from './serialize/PageConfigSerialized.js'

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
  loadConfigValuesAll: () => Promise<ConfigValueImported[]>
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
type DefinedAtInfoFull = // TODO: replace filePathRelativeToUserRootDir and importPathAbsolute with following?
// {
//   filePathAbsoluteVite: string
//   filePathAbsoluteResolved: string | null
// }
// In other places, rename: filePathRelativeToUserRootDir => filePathRelativeToViteRoot
(| {
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
