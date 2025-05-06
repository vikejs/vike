export { getConfigsUserFriendly }
export { getConfigsUserFriendly_oldDesign }
export { getPageConfigGlobalUserFriendly }
export type { PageConfigsUserFriendly }
export type { PageConfigUserFriendly }
export type { PageConfigUserFriendlyOld }
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
  PageConfigBuildTime,
  PageConfigGlobalRuntime,
  PageConfigRuntime,
  PageConfigRuntimeLoaded
} from './PageConfig.js'
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
  isTemplateFile
} from '../utils.js'
import pc from '@brillout/picocolors'
import type { ConfigResolved } from './Config/PageContextConfig.js'
import type { Route } from './Config.js'

// TODO/v1-release: remove
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
/** All the config's values (including overriden ones) and where they come from.
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
type PageConfigUserFriendlyOld = {
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
type SourceAny = SourceConfigs
/* TODO/eventually: https://github.com/vikejs/vike/issues/1268
  | SourceHooks
  | SourceRenderFailure
  | SourceVikeInternal
  */

type SourceConfigs = SourceConfigsStandard | SourceConfigsCumulative | SourceConfigsComputed
/* Potential upcoming feature: resolve cumulative values at config-time instead of runtime,
   in order to save KBs on the client-side.
 | SourceConfigsResolved
 */
type SourceConfigsStandard = {
  type: 'configsStandard'
  value: unknown
  definedAt: string
}
type SourceConfigsCumulative = {
  type: 'configsCumulative'
  values: {
    value: unknown
    definedAt: string
  }[]
}
type SourceConfigsComputed = {
  type: 'configsComputed'
  value: unknown
}

// See: [Flat `pageContext`](https://github.com/vikejs/vike/issues/1268)
type PageConfigUserFriendly = {
  config: ConfigResolved
  // TODO/now expose publicly?
  _source: Source
  _sources: Sources
  _from: From
}
type PageConfigsUserFriendly = Record<
  string, // pageId
  PageConfigUserFriendlyWithRoute
>
type WithRoute =
  | {
      route: Route
      isErrorPage?: undefined
    }
  | {
      route?: undefined
      isErrorPage: true
    }
type PageConfigUserFriendlyWithRoute = PageConfigUserFriendly & WithRoute
function getConfigsUserFriendly(
  pageConfigGlobalValues: ConfigValues,
  pageConfig: PageConfigRuntime | PageConfigBuildTime,
  pageConfigValues: ConfigValues
): [string, PageConfigUserFriendlyWithRoute] {
  const pageConfigUserFriendly = getConfigsUserFriendly_public({ pageConfigGlobalValues, pageConfigValues })
  let page: PageConfigUserFriendlyWithRoute
  if (!pageConfig.isErrorPage) {
    const route = pageConfigUserFriendly.config.route ?? pageConfig.routeFilesystem.routeString
    page = {
      ...pageConfigUserFriendly,
      route
    }
  } else {
    page = {
      ...pageConfigUserFriendly,
      isErrorPage: true
    }
  }
  return [pageConfig.pageId, page]
}
function getConfigsUserFriendly_public({
  pageConfigGlobalValues,
  pageConfigValues
}: { pageConfigGlobalValues: ConfigValues; pageConfigValues: ConfigValues }) {
  const pageConfigUserFriendly = getConfigsUserFriendly_base({ pageConfigGlobalValues, pageConfigValues })
  return getPublicCopy(pageConfigUserFriendly)
}
function getPublicCopy(
  pageConfigUserFriendly: ReturnType<typeof getConfigsUserFriendly_V1Design>
): PageConfigUserFriendly {
  const p = pageConfigUserFriendly
  return {
    config: p.config,
    _source: p.source,
    _sources: p.sources,
    _from: p.from
  }
}
function getConfigsUserFriendly_base({
  pageConfigGlobalValues,
  pageConfigValues
}: { pageConfigGlobalValues: ConfigValues; pageConfigValues: ConfigValues }) {
  const configValues = { ...pageConfigGlobalValues, ...pageConfigValues }
  return getConfigsUserFriendly_V1Design({ configValues })
}

function getPageConfigGlobalUserFriendly({
  pageConfigGlobalValues
}: { pageConfigGlobalValues: ConfigValues }): PageConfigUserFriendly {
  const pageConfigGlobalUserFriendly = getConfigsUserFriendly_V1Design({ configValues: pageConfigGlobalValues })
  return getPublicCopy(pageConfigGlobalUserFriendly)
}

function getConfigsUserFriendly_oldDesign(
  pageFiles: PageFile[],
  pageConfig: PageConfigRuntimeLoaded | null,
  pageConfigGlobal: PageConfigGlobalRuntime
): PageConfigUserFriendlyOld {
  const config: Record<string, unknown> = {}
  const configEntries: ConfigEntries = {} // TODO/v1-release: remove
  const exportsAll: ExportsAll = {} // TODO/v1-release: remove

  // V0.4 design
  // TODO/v1-release: remove
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
        _isFromDefaultExport: isFromDefaultExport
      })
    })
  })

  let source: Source
  let sources: Sources
  let from: From
  if (pageConfig) {
    const res = getConfigsUserFriendly_base({
      pageConfigGlobalValues: pageConfigGlobal.configValues,
      pageConfigValues: pageConfig.configValues
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
      configsComputed: {}
    }
  }

  const pageExports = createObjectWithDeprecationWarning()
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

    // TODO/eventually: deprecate/remove every prop below
    configEntries,
    exports,
    exportsAll,
    pageExports
  }
  return pageContextExports
}

// V1 design
function getConfigsUserFriendly_V1Design(pageConfig: { configValues: ConfigValues }) {
  const config: Record<string, unknown> = {}
  const configEntries: ConfigEntries = {}
  const exportsAll: ExportsAll = {}
  const source: Source = {}
  const sources: Sources = {}
  const from: From = {
    configsStandard: {},
    configsCumulative: {},
    configsComputed: {}
  }

  const addSrc = (src: SourceAny, configName: string) => {
    source[configName] = src
    sources[configName] ??= []
    sources[configName]!.push(src)
  }

  Object.entries(pageConfig.configValues).forEach(([configName, configValue]) => {
    const { value } = configValue
    const configValueFilePathToShowToUser = getConfigValueFilePathToShowToUser(configValue.definedAtData)
    const configDefinedAt = getConfigDefinedAtOptional('Config', configName, configValue.definedAtData)

    config[configName] = config[configName] ?? value
    configEntries[configName] = configEntries[configName] ?? []
    // Currently each configName has only one entry. Adding an entry for each overriden config value isn't implemented yet. (This is an isomorphic file and it isn't clear whether this can/should be implemented on the client-side. We should load a minimum amount of code on the client-side.)
    assert(configEntries[configName]!.length === 0)
    configEntries[configName]!.push({
      configValue: value,
      configDefinedAt,
      configDefinedByFile: configValueFilePathToShowToUser
    })

    if (configValue.type === 'standard') {
      const src: SourceConfigsStandard = {
        type: 'configsStandard',
        value: configValue.value,
        definedAt: getDefinedAtString(configValue.definedAtData, configName)
      }
      addSrc(src, configName)
      from.configsStandard[configName] = src
    }
    if (configValue.type === 'cumulative') {
      const src: SourceConfigsCumulative = {
        type: 'configsCumulative',
        values: configValue.value.map((value, i) => {
          const definedAtFile = configValue.definedAtData[i]
          assert(definedAtFile)
          const definedAt = getDefinedAtString(definedAtFile, configName)
          return {
            value,
            definedAt
          }
        })
      }
      addSrc(src, configName)
      from.configsCumulative[configName] = src
    }
    if (configValue.type === 'computed') {
      const src: SourceConfigsComputed = {
        type: 'configsComputed',
        value: configValue.value
      }
      addSrc(src, configName)
      from.configsComputed[configName] = src
    }

    // TODO/v1-release: remove
    const exportName = configName
    exportsAll[exportName] = exportsAll[exportName] ?? []
    exportsAll[exportName]!.push({
      exportValue: value,
      exportSource: configDefinedAt,
      filePath: configValueFilePathToShowToUser,
      _filePath: configValueFilePathToShowToUser,
      _fileType: null,
      _isFromDefaultExport: null
    })
  })

  return {
    config: config as any as ConfigResolved,
    configEntries,
    exportsAll,
    source,
    sources,
    from
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
              isFromDefaultExport
            })
          })
          return
        }
      }

      exportValues.push({
        exportName,
        exportValue,
        isFromDefaultExport
      })
    })

  exportValues.forEach(({ exportName, isFromDefaultExport }) => {
    assert(!(isFromDefaultExport && forbiddenDefaultExports.includes(exportName)))
  })

  return exportValues
}

// TODO/v1-release: remove
function createObjectWithDeprecationWarning(): Record<string, unknown> {
  return new Proxy(
    {},
    {
      get(...args) {
        // We only show the warning in Node.js because when using Client Routing Vue integration uses `Object.assign(pageContextReactive, pageContext)` which will wrongully trigger the warning. There is no cross-browser way to catch whether the property accessor was initiated by an `Object.assign()` call.
        if (!isBrowser()) {
          assertWarning(
            false,
            '`pageContext.pageExports` is outdated. Use `pageContext.exports` instead, see https://vike.dev/exports',
            { onlyOnce: true, showStackTrace: true }
          )
        }
        return Reflect.get(...args)
      }
    }
  )
}
