export type { PageConfig }
export type { PageConfigLoaded }
export type { ConfigEnvInternal }
export type { ConfigEnv }
export type { PageConfigBuildTime }
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
  // TODO: improve naming of `isCodeEntry` and `valueIsFilePath`?
  /**
   * Whether definedAtInfo.filePath contains runtime code. (If it doesn't, then it contains config code that isn't loaded in any runtime.)
   *
   * For example config.Page is a code entry. (Since the Page component is loaded by runtimes.)
   * Whereas config.passToClient is config-only and therefore isn't a code entry.
   */
  isCodeEntry: boolean
  valueIsFilePath?: true
} & (
  | {
      // TODO: replace definedAtInfo.filePath with definedAtInfo.filePathRelativeToUserRootDir? and definedAtInfo.filePathAbsolute!
      definedAtInfo: DefinedAtInfo
      isComputed: false
    }
  | {
      definedAtInfo: null
      isComputed: true
      isCodeEntry: false
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
  //  - computed
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
