export { parseGlobResults }

// TODO/v1-release: remove old design code, and remove all assertions.

import { assert, hasProp, isCallable, isObject, cast, isArray } from '../utils.js'
import { assertExportValues } from './assert_exports_old_design.js'
import { getPageFileObject, type PageFile } from './getPageFileObject.js'
import { fileTypes, type FileType } from './fileTypes.js'
import type { PageConfigRuntime, PageConfigGlobalRuntime } from '../page-configs/PageConfig.js'
import { parsePageConfigs } from '../page-configs/serialize/parsePageConfigs.js'
import type {
  PageConfigGlobalRuntimeSerialized,
  PageConfigRuntimeSerialized
} from '../page-configs/serialize/PageConfigSerialized.js'

// TODO/now: rename
function parseGlobResults(pageFilesExports: unknown): {
  pageFilesAll: PageFile[]
  pageConfigs: PageConfigRuntime[]
  pageConfigGlobal: PageConfigGlobalRuntime
} {
  assert(hasProp(pageFilesExports, 'pageFilesLazy', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesEager', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesExportNamesLazy', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesExportNamesEager', 'object'))
  assert(hasProp(pageFilesExports.pageFilesLazy, '.page'))
  assert(
    hasProp(pageFilesExports.pageFilesLazy, '.page.client') || hasProp(pageFilesExports.pageFilesLazy, '.page.server')
  )
  assert(hasProp(pageFilesExports, 'pageFilesList', 'string[]'))

  assert(hasProp(pageFilesExports, 'pageConfigsSerialized'))
  assert(hasProp(pageFilesExports, 'pageConfigGlobalSerialized'))
  const { pageConfigsSerialized, pageConfigGlobalSerialized } = pageFilesExports
  assertPageConfigsSerialized(pageConfigsSerialized)
  assertPageConfigGlobalSerialized(pageConfigGlobalSerialized)
  const { pageConfigs, pageConfigGlobal } = parsePageConfigs(pageConfigsSerialized, pageConfigGlobalSerialized)

  const pageFilesMap: Record<string, PageFile> = {}
  parseGlobResult(pageFilesExports.pageFilesLazy).forEach(({ filePath, pageFile, globValue }) => {
    pageFile = pageFilesMap[filePath] = pageFilesMap[filePath] ?? pageFile
    const loadModule = globValue
    assertLoadModule(loadModule)
    pageFile.loadFile = async () => {
      if (!('fileExports' in pageFile)) {
        pageFile.fileExports = await loadModule()
        assertExportValues(pageFile)
      }
    }
  })
  parseGlobResult(pageFilesExports.pageFilesExportNamesLazy).forEach(({ filePath, pageFile, globValue }) => {
    pageFile = pageFilesMap[filePath] = pageFilesMap[filePath] ?? pageFile
    const loadModule = globValue
    assertLoadModule(loadModule)
    pageFile.loadExportNames = async () => {
      if (!('exportNames' in pageFile)) {
        const moduleExports = await loadModule()
        assert(hasProp(moduleExports, 'exportNames', 'string[]'), pageFile.filePath)
        pageFile.exportNames = moduleExports.exportNames
      }
    }
  })
  // `pageFilesEager` contains `.page.route.js` files
  parseGlobResult(pageFilesExports.pageFilesEager).forEach(({ filePath, pageFile, globValue }) => {
    pageFile = pageFilesMap[filePath] = pageFilesMap[filePath] ?? pageFile
    const moduleExports = globValue
    assert(isObject(moduleExports))
    pageFile.fileExports = moduleExports
  })
  parseGlobResult(pageFilesExports.pageFilesExportNamesEager).forEach(({ filePath, pageFile, globValue }) => {
    pageFile = pageFilesMap[filePath] = pageFilesMap[filePath] ?? pageFile
    const moduleExports = globValue
    assert(isObject(moduleExports))
    assert(hasProp(moduleExports, 'exportNames', 'string[]'), pageFile.filePath)
    pageFile.exportNames = moduleExports.exportNames
  })

  pageFilesExports.pageFilesList.forEach((filePath) => {
    pageFilesMap[filePath] = pageFilesMap[filePath] ?? getPageFileObject(filePath)
  })

  const pageFilesAll = Object.values(pageFilesMap)
  pageFilesAll.forEach(({ filePath }) => {
    assert(!filePath.includes('\\'))
  })

  return { pageFilesAll, pageConfigs, pageConfigGlobal }
}

type GlobResult = { filePath: string; pageFile: PageFile; globValue: unknown }[]
function parseGlobResult(globObject: Record<string, unknown>): GlobResult {
  const ret: GlobResult = []
  Object.entries(globObject).forEach(([fileType, globFiles]) => {
    cast<FileType>(fileType)
    assert(fileTypes.includes(fileType))
    assert(isObject(globFiles))
    Object.entries(globFiles).forEach(([filePath, globValue]) => {
      const pageFile = getPageFileObject(filePath)
      assert(pageFile.fileType === fileType)
      ret.push({ filePath, pageFile, globValue })
    })
  })
  return ret
}

function assertLoadModule(globValue: unknown): asserts globValue is () => Promise<Record<string, unknown>> {
  assert(isCallable(globValue))
}

function assertPageConfigsSerialized(
  pageConfigsSerialized: unknown
): asserts pageConfigsSerialized is PageConfigRuntimeSerialized[] {
  assert(isArray(pageConfigsSerialized))
  pageConfigsSerialized.forEach((pageConfigSerialized) => {
    assert(isObject(pageConfigSerialized))
    assert(hasProp(pageConfigSerialized, 'pageId', 'string'))
    assert(hasProp(pageConfigSerialized, 'routeFilesystem'))
    assert(hasProp(pageConfigSerialized, 'configValuesSerialized'))
  })
}

function assertPageConfigGlobalSerialized(
  pageConfigGlobalSerialized: unknown
): asserts pageConfigGlobalSerialized is PageConfigGlobalRuntimeSerialized {
  assert(hasProp(pageConfigGlobalSerialized, 'configValuesSerialized'))
}
