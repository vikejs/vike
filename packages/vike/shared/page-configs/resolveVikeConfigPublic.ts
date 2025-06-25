// TODO/now-same-api: use public API internally?
// TODO/now-flat-pageContext: rename definedAt => definedBy
export { resolveVikeConfigPublicGlobal }
export { resolveVikeConfigPublicPageEager }
export { resolveVikeConfigPublicPageLazy }
export type { VikeConfigPublicGlobal }
export type { VikeConfigPublicPageEager }
export type { VikeConfigPublicPageLazy }
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
import type { ConfigResolved } from '../../types/Config/PageContextConfig.js'
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
type VikeConfigPublicPageLazy = {
  config: ConfigResolved
  source: Source
  sources: Sources
  from: From

  // TODO/eventually: deprecate every prop below
  configEntries: ConfigEntries
  exports: Record<string, unknown>
  exportsAll: ExportsAll
  /** @deprecated */
  pageExports: Record<string, unknown>
}

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

type VikeConfigPublic = {
  config: ConfigResolved
  // TODO/now-flat-pageContext: expose publicly?
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
type VikeConfigPublicPageEager = VikeConfigPublic & WithRoute
type VikeConfigPublicGlobal = VikeConfigPublic
function resolveVikeConfigPublicPageEager(
  pageConfigGlobalValues: ConfigValues,
  pageConfig: PageConfigRuntime | PageConfigBuildTime,
  pageConfigValues: ConfigValues,
): [string, VikeConfigPublicPageEager] {
  const vikeConfigPublicPage_ = resolveVikeConfigPublic_base({ pageConfigGlobalValues, pageConfigValues })
  const vikeConfigPublicPage = getPublicCopy(vikeConfigPublicPage_)
  let page: VikeConfigPublicPageEager
  if (!pageConfig.isErrorPage) {
    const route = vikeConfigPublicPage.config.route ?? pageConfig.routeFilesystem.routeString
    page = {
      ...vikeConfigPublicPage,
      route,
    }
  } else {
    page = {
      ...vikeConfigPublicPage,
      isErrorPage: true,
    }
  }
  return [pageConfig.pageId, page]
}
function getPublicCopy(vikeConfigPublic: ReturnType<typeof resolveVikeConfigPublic_V1Design>): VikeConfigPublic {
  return {
    config: vikeConfigPublic.config,
    _source: vikeConfigPublic.source,
    _sources: vikeConfigPublic.sources,
    _from: vikeConfigPublic.from,
  }
}
function resolveVikeConfigPublic_base({
  pageConfigGlobalValues,
  pageConfigValues,
}: { pageConfigGlobalValues: ConfigValues; pageConfigValues: ConfigValues }) {
  const configValues = { ...pageConfigGlobalValues, ...pageConfigValues }
  return resolveVikeConfigPublic_V1Design({ configValues })
}

function resolveVikeConfigPublicGlobal({
  pageConfigGlobalValues,
}: { pageConfigGlobalValues: ConfigValues }): VikeConfigPublicGlobal {
  const vikeConfigPublicGlobal = resolveVikeConfigPublic_V1Design({ configValues: pageConfigGlobalValues })
  return getPublicCopy(vikeConfigPublicGlobal)
}

function resolveVikeConfigPublicPageLazy(
  pageFiles: PageFile[], // V0.4 design
  pageConfig: PageConfigRuntimeLoaded | null, // V1 design
  pageConfigGlobal: PageConfigGlobalRuntime,
): VikeConfigPublicPageLazy {
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
        _filePath: pageFile.filePath, // TODO/next-major-release: remove
        _fileType: pageFile.fileType,
        _isFromDefaultExport: isFromDefaultExport,
      })
    })
  })

  let source: Source
  let sources: Sources
  let from: From
  if (pageConfig) {
    const res = resolveVikeConfigPublic_base({
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

  const pageContextExports = {
    config: config as any as ConfigResolved,
    from,
    source,
    sources,

    // TODO/now-flat-pageContext: deprecate every prop below
    configEntries,
    exports,
    exportsAll,
  }

  // TO-DO/next-major-release: remove
  objectDefineProperty(pageContextExports, 'pageExports', {
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

  return pageContextExports
}

// V1 design
function resolveVikeConfigPublic_V1Design(pageConfig: { configValues: ConfigValues }) {
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
