export { loadPageFiles }
export { getPageFilesAllClientSide }
export { getPageFilesAllServerSide }
export type PageContextExports = Pick<
  Awaited<ReturnType<typeof loadPageFiles>>,
  'exports' | 'exportsAll' | 'pageExports'
>
export type { PageFile }
export type { ExportsAll }
export { setPageFiles }
export { setPageFilesAsync }
export { getStringUnion }

import {
  assert,
  hasProp,
  isBrowser,
  isCallable,
  isObject,
  assertPosixPath,
  cast,
  assertWarning,
  assertUsage,
  unique,
  slice,
  makeLast,
} from './utils'
import { isErrorPage } from './route'
import { determinePageId } from './determinePageId'

assertNotAlreadyLoaded()

const fileTypes = ['.page', '.page.server', '.page.route', '.page.client'] as const
type FileType = typeof fileTypes[number]
type PageFile = {
  filePath: string
  fileType: FileType
  fileExports?: Record<string, unknown>
  loadFile?: () => Promise<void>
  exportNames?: string[]
  loadExportNames?: () => Promise<void>
  isRelevant: (pageId: string) => boolean
  isDefaultPageFile: boolean
  isRendererPageFile: boolean
  isErrorPageFile: boolean
  pageId: string
}

let _pageFilesAll: PageFile[] | undefined
let _pageFilesGetter: () => Promise<void> | undefined

function setPageFiles(pageFilesExports: unknown) {
  _pageFilesAll = format(pageFilesExports)
}
function setPageFilesAsync(getPageFilesExports: () => Promise<unknown>) {
  _pageFilesGetter = async () => {
    setPageFiles(await getPageFilesExports())
  }
}

async function getPageFilesAllServerSide(isProduction: boolean) {
  assert(_pageFilesGetter)
  if (
    !_pageFilesAll ||
    // We reload all glob imports in dev to make auto-reload work
    !isProduction
  ) {
    await _pageFilesGetter()
  }
  assert(_pageFilesAll)
  const pageFilesAll = _pageFilesAll
  const allPageIds = getAllPageIds(pageFilesAll)
  return { pageFilesAll, allPageIds }
}

function getPageFilesAllClientSide() {
  assert(!_pageFilesGetter)
  assert(_pageFilesAll)
  const pageFilesAll = _pageFilesAll
  const allPageIds = getAllPageIds(pageFilesAll)
  return { pageFilesAll, allPageIds }
}

function format(pageFilesExports: unknown) {
  assert(hasProp(pageFilesExports, 'isGeneratedFile'), 'Missing `isGeneratedFile`.')
  assert(pageFilesExports.isGeneratedFile !== false, `vite-plugin-ssr was re-installed(/re-built). Restart your app.`)
  assert(pageFilesExports.isGeneratedFile === true, `\`isGeneratedFile === ${pageFilesExports.isGeneratedFile}\``)
  assert(hasProp(pageFilesExports, 'pageFilesLazy', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesEager', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesExportNamesLazy', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesExportNamesEager', 'object'))
  assert(hasProp(pageFilesExports.pageFilesLazy, '.page'))
  assert(
    hasProp(pageFilesExports.pageFilesLazy, '.page.route') || hasProp(pageFilesExports.pageFilesEager, '.page.route'),
  )
  assert(
    hasProp(pageFilesExports.pageFilesLazy, '.page.client') || hasProp(pageFilesExports.pageFilesLazy, '.page.server'),
  )

  const pageFilesMap: Record<string, PageFile> = {}
  traverse(pageFilesExports.pageFilesLazy, pageFilesMap, (pageFile, globResult) => {
    const loadModule = globResult
    assertLoadModule(loadModule)
    pageFile.loadFile = async () => {
      if (!('fileExports' in pageFile)) {
        pageFile.fileExports = await loadModule()
      }
    }
  })
  traverse(pageFilesExports.pageFilesExportNamesLazy, pageFilesMap, (pageFile, globResult) => {
    const loadModule = globResult
    assertLoadModule(loadModule)
    pageFile.loadExportNames = async () => {
      if (!('exportNames' in pageFile)) {
        const moduleExports = await loadModule()
        assert(hasProp(moduleExports, 'exportNames', 'string[]'), pageFile.filePath)
        pageFile.exportNames = moduleExports.exportNames
      }
    }
  })
  traverse(pageFilesExports.pageFilesEager, pageFilesMap, (pageFile, globResult) => {
    const moduleExports = globResult
    assert(isObject(moduleExports))
    pageFile.fileExports = moduleExports
  })
  traverse(pageFilesExports.pageFilesExportNamesEager, pageFilesMap, (pageFile, globResult) => {
    const moduleExports = globResult
    assert(isObject(moduleExports))
    assert(hasProp(moduleExports, 'exportNames', 'string[]'), pageFile.filePath)
    pageFile.exportNames = moduleExports.exportNames
  })

  const pageFiles = Object.values(pageFilesMap)
  pageFiles.forEach(({ filePath }) => {
    assert(!filePath.includes('\\'))
  })

  return pageFiles
}
function assertLoadModule(globResult: unknown): asserts globResult is () => Promise<Record<string, unknown>> {
  assert(isCallable(globResult))
}
function traverse(
  globObject: Record<string, unknown>,
  pageFilesMap: Record<string, PageFile>,
  visitor: (pageFile: PageFile, globResult: unknown) => void,
) {
  Object.entries(globObject).forEach(([fileType, globFiles]) => {
    cast<FileType>(fileType)
    assert(fileTypes.includes(fileType))
    assert(isObject(globFiles))
    Object.entries(globFiles).forEach(([filePath, globResult]) => {
      const isRelevant = (pageId: string): boolean =>
        pageFile.pageId === pageId ||
        (pageFile.isDefaultPageFile &&
          (pageFile.isRendererPageFile || isAncestorDefaultPage(pageId, pageFile.filePath)))
      const pageFile = (pageFilesMap[filePath] = pageFilesMap[filePath] ?? {
        filePath,
        fileType,
        isRelevant,
        isDefaultPageFile: isDefaultFilePath(filePath),
        isRendererPageFile: isRendererFilePath(filePath),
        isErrorPageFile: isErrorPage(filePath),
        pageId: determinePageId(filePath),
      })
      visitor(pageFile, globResult)
    })
  })
}

function isDefaultFilePath(filePath: string): boolean {
  assertPosixPath(filePath)
  assert(filePath.startsWith('/'))
  return filePath.includes('/_default')
}
function isRendererFilePath(filePath: string): boolean {
  assertPosixPath(filePath)
  assert(filePath.startsWith('/'))
  return filePath.includes('/renderer/')
}

type ExportsAll = Record<
  string,
  { exportValue: unknown; filePath: string; _fileType: FileType; _isDefaultExport: boolean }[]
>
async function loadPageFiles(pageFilesAll: PageFile[], pageId: string, isForClientSide: boolean) {
  const pageFiles = findPageFilesToLoad(pageFilesAll, pageId, isForClientSide)
  await Promise.all(pageFiles.map((p) => p.loadFile?.()))

  const exportsAll: ExportsAll = {}
  const addExport = ({
    exportName,
    exportValue,
    filePath,
    fileType,
    isDefaultExport,
  }: {
    exportName: string
    exportValue: unknown
    fileType: FileType
    filePath: string
    isDefaultExport: boolean
  }) => {
    assert(exportName !== 'default')
    exportsAll[exportName] = exportsAll[exportName] ?? []
    exportsAll[exportName]!.push({
      exportValue,
      filePath: filePath,
      _fileType: fileType,
      _isDefaultExport: isDefaultExport,
    })
  }

  pageFiles.forEach(({ filePath, fileType, fileExports }) => {
    Object.entries(fileExports ?? {})
      .sort(makeLast(([exportName]) => exportName === 'default')) // `export { bla }` should override `export default { bla }`
      .forEach(([exportName, exportValue]) => {
        let isDefaultExport = exportName === 'default'

        if (isDefaultExport) {
          if (!isJavaScriptFile(filePath)) {
            // `.vue` and `.md` files
            exportName = 'Page'
          } else {
            assertUsage(isObject(exportValue), `The \`export default\` of ${filePath} should be an object.`)
            Object.entries(exportValue).forEach(([defaultExportName, defaultExportValue]) => {
              addExport({
                exportName: defaultExportName,
                exportValue: defaultExportValue,
                filePath,
                fileType,
                isDefaultExport,
              })
            })
            return
          }
        }

        addExport({
          exportName,
          exportValue,
          filePath,
          fileType,
          isDefaultExport,
        })
      })
  })

  const pageExports = createObjectWithDeprecationWarning()
  const exports: Record<string, unknown> = {}
  Object.entries(exportsAll).forEach(([exportName, values]) => {
    values.forEach(({ exportValue, _fileType, _isDefaultExport }) => {
      exports[exportName] = exports[exportName] ?? exportValue

      // Legacy `pageContext.pageExports`
      if (_fileType === '.page' && !_isDefaultExport) {
        if (!(exportName in pageExports)) {
          pageExports[exportName] = exportValue
        }
      }
    })
  })

  assert(!('default' in exports))
  assert(!('default' in exportsAll))
  const pageContextAddendum = {
    exports,
    pageExports,
    exportsAll,
    _loadedPageFiles: pageFiles.map((p) => p.filePath),
  }
  return pageContextAddendum
}

function isJavaScriptFile(filePath: string) {
  // `.mjs`
  // `.cjs`
  // `.js`
  // `.tsx`
  // ...
  return /\.(c|m)?(j|t)sx?$/.test(filePath)
}

function findPageFilesToLoad(pageFilesAll: PageFile[], pageId: string, isForClientSide: boolean) {
  const fileTypeEnvSpecific = isForClientSide ? ('.page.client' as const) : ('.page.server' as const)
  const defaultFiles = [
    ...pageFilesAll.filter((p) => p.isDefaultPageFile && p.isRelevant(pageId) && p.fileType === fileTypeEnvSpecific),
    ...pageFilesAll.filter((p) => p.isDefaultPageFile && p.isRelevant(pageId) && p.fileType === '.page'),
  ]
  defaultFiles.sort(defaultFilesSorter(fileTypeEnvSpecific, pageId))
  const pageFiles = [
    ...pageFilesAll.filter((p) => p.pageId === pageId && p.fileType === fileTypeEnvSpecific),
    ...pageFilesAll.filter((p) => p.pageId === pageId && p.fileType === '.page'),
    ...defaultFiles,
  ]
  return pageFiles
}

function defaultFilesSorter(fileTypeEnvSpecific: FileType, pageId: string) {
  const e1First = -1 as const
  const e2First = +1 as const
  const noOrder = 0 as const
  return (e1: PageFile, e2: PageFile): 0 | 1 | -1 => {
    assert(e1.isDefaultPageFile && e2.isDefaultPageFile)

    {
      const e1_isRenderer = e1.isRendererPageFile
      const e2_isRenderer = e2.isRendererPageFile
      if (!e1_isRenderer && e2_isRenderer) {
        return e1First
      }
      if (!e2_isRenderer && e1_isRenderer) {
        return e2First
      }
      assert(e1_isRenderer === e2_isRenderer)
    }

    {
      const e1_distance = getPathDistance(pageId, e1.filePath)
      const e2_distance = getPathDistance(pageId, e2.filePath)
      if (e1_distance < e2_distance) {
        return e1First
      }
      if (e2_distance < e1_distance) {
        return e2First
      }
      assert(e1_distance === e2_distance)
    }

    {
      if (e1.fileType === fileTypeEnvSpecific && e2.fileType !== fileTypeEnvSpecific) {
        return e1First
      }
      if (e2.fileType === fileTypeEnvSpecific && e1.fileType !== fileTypeEnvSpecific) {
        return e2First
      }
    }

    /*
    {
      if (e1.fileType === '.page' && e2.fileType !== '.page') {
        return e2First
      }
      if (e2.fileType === '.page' && e1.fileType !== '.page') {
        return e1First
      }
    }
    */

    return noOrder
  }
}

function assertNotAlreadyLoaded() {
  // The functionality of this file will fail if it's loaded more than
  // once; we assert that it's loaded only once.
  const alreadyLoaded = Symbol()
  const globalObject: any = isBrowser() ? window : global
  assert(!globalObject[alreadyLoaded])
  globalObject[alreadyLoaded] = true
}

function createObjectWithDeprecationWarning(): Record<string, unknown> {
  return new Proxy(
    {},
    {
      get(...args) {
        assertWarning(
          false,
          '`pageContext.pageExports` is deprecated. Use `pageContext.exports` instead, see https://vite-plugin-ssr.com/exports',
          { onlyOnce: true },
        )
        return Reflect.get(...args)
      },
    },
  )
}

function getStringUnion(exportsAll: ExportsAll, propName: string): string[] {
  return (
    exportsAll[propName]
      ?.map((e) => {
        assertUsage(
          hasProp(e, 'exportValue', 'string[]'),
          `\`export { ${propName} }\` of ${e.filePath} should be an array of strings.`,
        )
        return e.exportValue
      })
      .flat() ?? []
  )
}

function getAllPageIds(allPageFiles: { filePath: string; isDefaultPageFile: boolean }[]): string[] {
  const fileIds = allPageFiles
    .filter(({ isDefaultPageFile }) => !isDefaultPageFile)
    .map(({ filePath }) => filePath)
    .map(determinePageId)
  const allPageIds = unique(fileIds)
  return allPageIds
}

function getPathDistance(pathA: string, pathB: string): number {
  assertPosixPath(pathA)
  assertPosixPath(pathB)
  assert(pathA.startsWith('/'))
  assert(pathB.startsWith('/'))

  // Index of first different character
  let idx = 0
  for (; idx < pathA.length && idx < pathB.length; idx++) {
    if (pathA[idx] !== pathB[idx]) break
  }

  const pathAWithoutCommon = pathA.slice(idx)
  const pathBWithoutCommon = pathB.slice(idx)

  const distanceA = pathAWithoutCommon.split('/').length
  const distanceB = pathBWithoutCommon.split('/').length

  const distance = distanceA + distanceB

  return distance
}

function isAncestorDefaultPage(pageId: string, defaultPageFilePath: string) {
  assertPosixPath(pageId)
  assertPosixPath(defaultPageFilePath)
  assert(pageId.startsWith('/'))
  assert(defaultPageFilePath.startsWith('/'))
  assert(!pageId.endsWith('/'))
  assert(!defaultPageFilePath.endsWith('/'))
  assert(isDefaultFilePath(defaultPageFilePath))

  const defaultPageDir = slice(defaultPageFilePath.split('/'), 0, -1).join('/')
  return pageId.startsWith(defaultPageDir)
}
