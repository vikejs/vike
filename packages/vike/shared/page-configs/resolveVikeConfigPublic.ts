// TODO/now: rename PageConfig names
// - Use `Internal` suffix, i.e. {Page,Global}ConfigInternal
//   - While keeping {Page,Global}ConfigPublic or remove Public suffix and rename it to {Page,Global}Config ?
// - rename EagerLoaded EagerlyLoaded
// - remove `LazyLoaded` suffix

// TO-DO/soon/same-api: use public API internally?
// TO-DO/soon/flat-pageContext: rename definedAt => definedBy
export { resolveGlobalConfigPublic }
export { resolvePageContextConfig }
export { resolveGlobalContextConfig }
export type { PageContextConfig }
export type { GlobalConfigPublic }
export type { Source }
export type { Sources }
export type { From }
export type { ExportsAll }
export type { ConfigEntries }

import { assertDefaultExports, forbiddenDefaultExports } from '../getPageFiles/assert_exports_old_design.js'
import type { FileType } from '../getPageFiles/fileTypes.js'
import type { PageFile } from '../getPageFiles/getPageFileObject.js'
import type {
  ConfigValues,
  DefinedAtData,
  PageConfigBuildTime,
  PageConfigGlobalBuildTime,
  PageConfigGlobalRuntime,
  PageConfigRuntime,
  PageConfigRuntimeLoaded,
} from '../../types/PageConfig.js'
import { type ConfigDefinedAtOptional, getConfigDefinedAtOptional, getDefinedAtString } from './getConfigDefinedAt.js'
import { getConfigValueFilePathToShowToUser } from './helpers.js'
import {
  assert,
  isObject,
  assertWarning,
  assertUsage,
  makeLast,
  isBrowser,
  isScriptFile,
  isTemplateFile,
  objectDefineProperty,
} from '../utils.js'
import pc from '@brillout/picocolors'
import type { ConfigResolved } from '../../types/Config/ConfigResolved.js'
import type { Route } from '../../types/Config.js'

// TO-DO/next-major-release: remove
type ExportsAll = Record<
  string,
  {
    exportValue: unknown
    exportSource: string
    filePath: string | null
    /** @deprecated */
    _fileType: FileType | null
    /** @deprecated */
    _isFromDefaultExport: boolean | null
    /** @deprecated */
    _filePath: string | null
  }[]
>
/** All the config's values (including overridden ones) and where they come from.
 *
 * https://vike.dev/pageContext
 */
type ConfigEntries = Record<
  string,
  {
    configValue: unknown
    configDefinedAt: ConfigDefinedAtOptional
    configDefinedByFile: string | null
  }[]
>
type From = {
  configsStandard: Record<
    string, // configName
    SourceConfigsStandard
  >
  configsCumulative: Record<
    string, // configName
    SourceConfigsCumulative
  >
  configsComputed: Record<
    string, // configName
    SourceConfigsComputed
  >
}

type Source = Record<
  string, // configName
  SourceAny
>
type Sources = Record<
  string, // configName
  SourceAny[]
>
type SourceAny = SourceConfigsStandard | SourceConfigsCumulative | SourceConfigsComputed
/* TO-DO/eventually: https://github.com/vikejs/vike/issues/1268
  | SourceHooks
  | SourceRequest
  | SourceVike
// Defined by user hook
type SourceHooks = {
  type: 'hooks'
  value: unknown
  // Whether the value comes from previously aborted (e.g. `throw render()`) or failed render (e.g. hook throwing an error).
  // https://github.com/vikejs/vike/issues/1112
  isFromPreviousRender?: number
  definedAt: string
}
// Defined by renderPage(pageContextInit)
type SourceRequest = {
  type: 'request'
  value: unknown
  definedAt: 'renderPage()'
}
// Defined by Vike (Vike built-ins)
type SourceVike = {
  type: 'vike'
  value: unknown
  definedAt: 'Vike'
}
//*/

type SourceConfigsStandard = {
  type: 'configsStandard'
  value: unknown
  definedAt: string
}
type SourceConfigsCumulative = {
  type: 'configsCumulative'
  definedAt: string
  values: {
    value: unknown
    definedAt: string
  }[]
}
type SourceConfigsComputed = {
  type: 'configsComputed'
  definedAt: 'Vike'
  value: unknown
}

type ConfigPublic = {
  config: ConfigResolved
  // TO-DO/soon/flat-pageContext: expose publicly?
  _source: Source
  _sources: Sources
  _from: From
}
type WithRoute =
  | {
      route: Route
      isErrorPage?: undefined
    }
  | {
      route?: undefined
      isErrorPage: true
    }

type PageContextConfig = {
  /** The page's configuration values.
   *
   * https://vike.dev/config
   * https://vike.dev/pageContext#config
   */
  config: ConfigResolved

  source: Source
  sources: Sources
  from: From

  // TO-DO/eventually: deprecate every prop below

  /** The page's configuration, including the configs origin and overridden configs.
   *
   * https://vike.dev/config
   */
  configEntries: ConfigEntries

  /** Custom Exports/Hooks.
   *
   * https://vike.dev/exports
   */
  exports: Record<string, unknown>

  /**
   * Same as `pageContext.exports` but cumulative.
   *
   * https://vike.dev/exports
   */
  exportsAll: ExportsAll

  /** @deprecated */
  pageExports: Record<string, unknown>
}

type PageConfigPublicWithRoute = ConfigPublic & WithRoute
function resolveGlobalConfigPage(
  pageConfigGlobalValues: ConfigValues,
  pageConfig: PageConfigRuntime | PageConfigBuildTime,
  pageConfigValues: ConfigValues,
): [string, PageConfigPublicWithRoute] {
  const pageConfigPublic_ = resolveGlobalConfigPublic_base({ pageConfigGlobalValues, pageConfigValues })
  const pageConfigPublic = getPublicCopy(pageConfigPublic_)
  let page: PageConfigPublicWithRoute
  if (!pageConfig.isErrorPage) {
    const route = pageConfigPublic.config.route ?? pageConfig.routeFilesystem.routeString
    page = {
      ...pageConfigPublic,
      route,
    }
  } else {
    page = {
      ...pageConfigPublic,
      isErrorPage: true,
    }
  }
  return [pageConfig.pageId, page]
}
function getPublicCopy(configPublic: ReturnType<typeof resolveConfigPublic_V1Design>) {
  return {
    config: configPublic.config,
    _source: configPublic.source,
    _sources: configPublic.sources,
    _from: configPublic.from,
  }
}
function resolveGlobalConfigPublic_base({
  pageConfigGlobalValues,
  pageConfigValues,
}: { pageConfigGlobalValues: ConfigValues; pageConfigValues: ConfigValues }) {
  const configValues = { ...pageConfigGlobalValues, ...pageConfigValues }
  return resolveConfigPublic_V1Design({ configValues })
}

function resolvePageContextConfig(
  pageFiles: PageFile[], // V0.4 design
  pageConfig: PageConfigRuntimeLoaded | null, // V1 design
  pageConfigGlobal: PageConfigGlobalRuntime,
): PageContextConfig {
  const config: Record<string, unknown> = {}
  const configEntries: ConfigEntries = {} // TO-DO/next-major-release: remove
  const exportsAll: ExportsAll = {} // TO-DO/next-major-release: remove

  // V0.4 design
  // TO-DO/next-major-release: remove
  pageFiles.forEach((pageFile) => {
    const exportValues = getExportValues(pageFile)
    exportValues.forEach(({ exportName, exportValue, isFromDefaultExport }) => {
      assert(exportName !== 'default')
      exportsAll[exportName] = exportsAll[exportName] ?? []
      exportsAll[exportName]!.push({
        exportValue,
        exportSource: `${pageFile.filePath} > ${
          isFromDefaultExport ? `\`export default { ${exportName} }\`` : `\`export { ${exportName} }\``
        }`,
        filePath: pageFile.filePath,
        _filePath: pageFile.filePath, // TO-DO/next-major-release: remove
        _fileType: pageFile.fileType,
        _isFromDefaultExport: isFromDefaultExport,
      })
    })
  })

  let source: Source
  let sources: Sources
  let from: From
  if (pageConfig) {
    const res = resolveGlobalConfigPublic_base({
      pageConfigGlobalValues: pageConfigGlobal.configValues,
      pageConfigValues: pageConfig.configValues,
    })
    source = res.source
    sources = res.sources
    from = res.from
    Object.assign(config, res.config)
    Object.assign(configEntries, res.configEntries)
    Object.assign(exportsAll, res.exportsAll)
  } else {
    source = {}
    sources = {}
    from = {
      configsStandard: {},
      configsCumulative: {},
      configsComputed: {},
    }
  }

  const pageExports: Record<string, unknown> = {}
  const exports: Record<string, unknown> = {}
  Object.entries(exportsAll).forEach(([exportName, values]) => {
    values.forEach(({ exportValue, _fileType, _isFromDefaultExport }) => {
      exports[exportName] = exports[exportName] ?? exportValue

      // Legacy pageContext.pageExports
      if (_fileType === '.page' && !_isFromDefaultExport) {
        if (!(exportName in pageExports)) {
          pageExports[exportName] = exportValue
        }
      }
    })
  })

  assert(!('default' in exports))
  assert(!('default' in exportsAll))

  const pageContextAddendum = {
    config: config as any as ConfigResolved,
    from,
    source,
    sources,

    // TO-DO/soon/flat-pageContext: deprecate every prop below
    configEntries,
    exports,
    exportsAll,
  }

  // TO-DO/next-major-release: remove
  objectDefineProperty(pageContextAddendum, 'pageExports', {
    get: () => {
      // We only show the warning in Node.js because when using Client Routing Vue integration uses `Object.assign(pageContextReactive, pageContext)` which will wrongully trigger the warning. There is no cross-browser way to catch whether the property accessor was initiated by an `Object.assign()` call.
      if (!isBrowser()) {
        assertWarning(false, 'pageContext.pageExports is outdated, use pageContext.exports instead', {
          onlyOnce: true,
          showStackTrace: true,
        })
      }
      return pageExports
    },
    enumerable: false,
    configurable: true,
  })

  return pageContextAddendum
}

function resolveGlobalContextConfig(pageConfigs: PageConfigRuntime[], pageConfigGlobal: PageConfigGlobalRuntime) {
  return resolveGlobalConfigPublic(pageConfigs, pageConfigGlobal, (c) => c.configValues)
}

type GlobalConfigPublic = Omit<ReturnType<typeof resolveGlobalConfigPublic>, '_globalConfigPublic'>
function resolveGlobalConfigPublic<
  PageConfig extends PageConfigRuntime | PageConfigBuildTime,
  PageConfigGlobal extends PageConfigGlobalRuntime | PageConfigGlobalBuildTime,
>(
  pageConfigs: PageConfig[],
  pageConfigGlobal: PageConfigGlobal,
  getConfigValues: (config: PageConfig | PageConfigGlobal, isGlobalConfig?: true) => ConfigValues,
) {
  // global
  const pageConfigGlobalValues = getConfigValues(pageConfigGlobal, true)
  const globalConfigPublicBase_ = resolveConfigPublic_V1Design({ configValues: pageConfigGlobalValues })
  const globalConfigPublicBase = getPublicCopy(globalConfigPublicBase_)

  // pages
  const pages = Object.fromEntries(
    pageConfigs.map((pageConfig) => {
      const pageConfigValues = getConfigValues(pageConfig)
      return resolveGlobalConfigPage(pageConfigGlobalValues, pageConfig, pageConfigValues)
    }),
  )

  const globalConfigPublic = {
    ...globalConfigPublicBase,
    pages,
  }
  return {
    ...globalConfigPublic,
    _globalConfigPublic: globalConfigPublic,
  }
}

// V1 design
function resolveConfigPublic_V1Design(pageConfig: { configValues: ConfigValues }) {
  const config: Record<string, unknown> = {}
  const configEntries: ConfigEntries = {}
  const exportsAll: ExportsAll = {}
  const source: Source = {}
  const sources: Sources = {}
  const from: From = {
    configsStandard: {},
    configsCumulative: {},
    configsComputed: {},
  }

  const addSrc = (src: SourceAny, configName: string) => {
    source[configName] = src
    sources[configName] ??= []
    sources[configName]!.push(src)
  }

  const addLegacy = (configName: string, value: unknown, definedAtData: DefinedAtData) => {
    const configValueFilePathToShowToUser = getConfigValueFilePathToShowToUser(definedAtData)
    const configDefinedAt = getConfigDefinedAtOptional('Config', configName, definedAtData)

    configEntries[configName] = configEntries[configName] ?? []
    configEntries[configName]!.push({
      configValue: value,
      configDefinedAt,
      configDefinedByFile: configValueFilePathToShowToUser,
    })

    // TO-DO/next-major-release: remove
    const exportName = configName
    exportsAll[exportName] = exportsAll[exportName] ?? []
    exportsAll[exportName]!.push({
      exportValue: value,
      exportSource: configDefinedAt,
      filePath: configValueFilePathToShowToUser,
      _filePath: configValueFilePathToShowToUser,
      _fileType: null,
      _isFromDefaultExport: null,
    })
  }

  Object.entries(pageConfig.configValues).forEach(([configName, configValue]) => {
    const { value } = configValue

    config[configName] = config[configName] ?? value

    if (configValue.type === 'standard') {
      const src: SourceConfigsStandard = {
        type: 'configsStandard',
        value: configValue.value,
        definedAt: getDefinedAtString(configValue.definedAtData, configName),
      }
      addSrc(src, configName)
      from.configsStandard[configName] = src
      addLegacy(configName, value, configValue.definedAtData)
    }
    if (configValue.type === 'cumulative') {
      const src: SourceConfigsCumulative = {
        type: 'configsCumulative',
        definedAt: getDefinedAtString(configValue.definedAtData, configName),
        values: configValue.value.map((value, i) => {
          const definedAtFile = configValue.definedAtData[i]
          assert(definedAtFile)
          const definedAt = getDefinedAtString(definedAtFile, configName)
          addLegacy(configName, value, definedAtFile)
          return {
            value,
            definedAt,
          }
        }),
      }
      addSrc(src, configName)
      from.configsCumulative[configName] = src
    }
    if (configValue.type === 'computed') {
      const src: SourceConfigsComputed = {
        type: 'configsComputed',
        definedAt: 'Vike', // Vike currently doesn't support user-land computed configs => computed configs are always defined by Vike => there isn't any file path to show.
        value: configValue.value,
      }
      addSrc(src, configName)
      from.configsComputed[configName] = src
      addLegacy(configName, value, configValue.definedAtData)
    }
  })

  return {
    config: config as any as ConfigResolved,
    configEntries,
    exportsAll,
    source,
    sources,
    from,
  }
}

function getExportValues(pageFile: PageFile) {
  const { filePath, fileExports } = pageFile
  assert(fileExports) // assume pageFile.loadFile() was called
  assert(isScriptFile(filePath))

  const exportValues: {
    exportName: string
    exportValue: unknown
    isFromDefaultExport: boolean
  }[] = []

  Object.entries(fileExports)
    .sort(makeLast(([exportName]) => exportName === 'default')) // `export { bla }` should override `export default { bla }`
    .forEach(([exportName, exportValue]) => {
      let isFromDefaultExport = exportName === 'default'

      if (isFromDefaultExport) {
        if (isTemplateFile(filePath)) {
          exportName = 'Page'
        } else {
          assertUsage(isObject(exportValue), `The ${pc.cyan('export default')} of ${filePath} should be an object.`)
          Object.entries(exportValue).forEach(([defaultExportName, defaultExportValue]) => {
            assertDefaultExports(defaultExportName, filePath)
            exportValues.push({
              exportName: defaultExportName,
              exportValue: defaultExportValue,
              isFromDefaultExport,
            })
          })
          return
        }
      }

      exportValues.push({
        exportName,
        exportValue,
        isFromDefaultExport,
      })
    })

  exportValues.forEach(({ exportName, isFromDefaultExport }) => {
    assert(!(isFromDefaultExport && forbiddenDefaultExports.includes(exportName)))
  })

  return exportValues
}
