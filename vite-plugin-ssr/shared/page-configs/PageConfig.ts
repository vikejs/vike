export type { PageConfig }
export type { PageConfigLoaded }
export type { ConfigEnvInternal }
export type { ConfigEnv }
export type { PageConfigData }
export type { PageConfigBuildTime }
export type { PageConfigGlobal }
export type { PageConfigGlobalData }
export type { ConfigSource }
export type { ConfigValue }
export type { ConfigValues }
export type { ConfigValueSource }
export type { ConfigValueSources }
export type { DefinedAt }

type ConfigEnv = 'client-only' | 'server-only' | 'server-and-client' | 'config-only'
type ConfigEnvInternal = ConfigEnv | '_routing-eager' | '_routing-lazy'

type PageConfigRuntime = Omit<PageConfigData, 'configValues'> & {
  configValues: NonNullable<PageConfigData['configValues']>
}
type PageConfigBuildTime = Omit<PageConfigData, 'configValueSources'> & {
  configValueSources: Required<PageConfigData['configValueSources']>
}

type PageConfigData = {
  pageId: string
  isErrorPage: boolean
  // TODO: unify to routeFilesystem: null | { routeString: string, definedBy: string }
  routeFilesystem: null | string
  routeFilesystemDefinedBy: null | string
  configValueSources: ConfigValueSources
  configValues: null | ConfigValues
}
type ConfigValueSource = {
  configEnv: ConfigEnvInternal
  valueSerialized?: string
  value?: unknown
  // Replace definedAt.filePath with definedAt.filePathRelativeToUserRootDir? and definedAt.filePathAbsolute!
  definedAt: DefinedAt
  /**
   * Whether definedAt.filePath contains runtime code. (If it doesn't, then it contains config code that isn't loaded in any runtime.)
   *
   * For example config.Page is a code entry. (Since the Page component is loaded by runtimes.)
   * Whereas config.passToClient is config-only and therefore isn't a code entry.
   */
  isCodeEntry: boolean
  isFilePath?: true
}
type ConfigValueSources = Record<
  // configName
  string,
  ConfigValueSource[]
>
type ConfigValue = {
  value: unknown
  // TODO: Replace with valueSrc?
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
type PageConfig = PageConfigRuntime & {
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
