export { loadPageFilesClientSide }
export { getPageFilesAllClientSide }
export type PageContextPageFilesClientSide = Awaited<ReturnType<typeof loadPageFilesClientSide>>
export type { PageFile3 }
export { setPageFilesServerSide }
export { setPageFilesClientSide }
export { setPageFilesServerSideAsync }

import { isErrorPage } from './route'
import { determinePageId, determinePageIds } from './determinePageIds'
import { assert, getPathDistance, hasProp, isBrowser, isCallable, isObject, assertPosixPath, cast } from './utils'

assertNotAlreadyLoaded()

const fileTypes = ['.page', '.page.server', '.page.route', '.page.client'] as const
type FileType = typeof fileTypes[number]
type PageFile3 = {
  filePath: string
  fileType: FileType
  fileExports?: Record<string, unknown>
  loadFileExports?: () => Promise<void>
  meta?: Record<string, unknown>
  loadMeta?: () => Promise<void>
  isDefaultPageFile: boolean
  isErrorPageFile: boolean
  pageId: string
}

let _pageFilesAll: PageFile3[] | undefined
let _pageFilesGetter: () => Promise<void> | undefined

function setPageFilesServerSide(pageFilesExports: unknown) {
  _pageFilesAll = format(pageFilesExports)
}
function setPageFilesServerSideAsync(getPageFilesExports: () => Promise<unknown>) {
  _pageFilesGetter = async () => {
    setPageFilesClientSide(await getPageFilesExports())
  }
}
function setPageFilesClientSide(pageFilesExports: unknown) {
  _pageFilesAll = format(pageFilesExports)
}

async function getPageFilesAllServerSide(pageContext: { _isProduction: boolean }) {
  if (!_pageFilesAll) {
    _pageFilesGetter
  }
  if (_pageFilesGetter) {
    if (
      !_pageFilesAll ||
      // We reload all glob imports in dev to make auto-reload work
      !pageContext._isProduction
    ) {
      await _pageFilesGetter()
    }
    assert(_pageFilesAll)
  }
  assert(_pageFilesAll)
  return _pageFilesAll
}

function getPageFilesAllClientSide() {
  assert(_pageFilesAll)
  const pageFilesAll = _pageFilesAll
  const allPageIds = determinePageIds(pageFilesAll)
  return { pageFilesAll, allPageIds }
}

function format(pageFilesExports: unknown) {
  assert(hasProp(pageFilesExports, 'isGeneratedFile'), 'Missing `isGeneratedFile`.')
  assert(pageFilesExports.isGeneratedFile === true, `\`isGeneratedFile === ${pageFilesExports.isGeneratedFile}\``)
  assert(hasProp(pageFilesExports, 'pageFilesLazy', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesEager', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesMetaLazy', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesMetaEager', 'object'))
  assert(hasProp(pageFilesExports.pageFilesLazy, '.page'))
  assert(
    hasProp(pageFilesExports.pageFilesLazy, '.page.route') || hasProp(pageFilesExports.pageFilesEager, '.page.route'),
  )
  assert(
    hasProp(pageFilesExports.pageFilesLazy, '.page.client') || hasProp(pageFilesExports.pageFilesLazy, '.page.server'),
  )
  assert(
    hasProp(pageFilesExports.pageFilesMetaLazy, '.page.client') ||
      hasProp(pageFilesExports.pageFilesMetaLazy, '.page.server'),
  )

  const pageFilesMap: Record<string, PageFile3> = {}
  traverse(pageFilesExports.pageFilesLazy, pageFilesMap, (pageFile, globResult) => {
    const loadModule = globResult
    assertLoadModule(loadModule)
    pageFile.loadFileExports = async () => {
      if (!('fileExports' in pageFile)) {
        pageFile.fileExports = await loadModule()
      }
    }
  })
  traverse(pageFilesExports.pageFilesMetaLazy, pageFilesMap, (pageFile, globResult) => {
    const loadModule = globResult
    assertLoadModule(loadModule)
    pageFile.loadMeta = async () => {
      if (!('meta' in pageFile)) {
        pageFile.meta = await loadModule()
      }
    }
  })
  traverse(pageFilesExports.pageFilesEager, pageFilesMap, (pageFile, globResult) => {
    const moduleExports = globResult
    assertModuleExports(moduleExports)
    pageFile.fileExports = moduleExports
  })
  traverse(pageFilesExports.pageFilesMetaEager, pageFilesMap, (pageFile, globResult) => {
    const moduleExports = globResult
    assertModuleExports(moduleExports)
    pageFile.meta = moduleExports
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
function assertModuleExports(globResult: unknown): asserts globResult is Record<string, unknown> {
  assert(isObject(globResult))
}
function traverse(
  globObject: Record<string, unknown>,
  pageFilesMap: Record<string, PageFile3>,
  visitor: (pageFile: PageFile3, globResult: unknown) => void,
) {
  Object.entries(globObject).forEach(([fileType, globFiles]) => {
    cast<FileType>(fileType)
    assert(fileTypes.includes(fileType))
    assert(isObject(globFiles))
    Object.entries(globFiles).forEach(([filePath, globResult]) => {
      const pageFile = (pageFilesMap[filePath] = pageFilesMap[filePath] ?? {
        filePath,
        fileType,
        isDefaultPageFile: isDefaultFilePath(filePath),
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

type ExportsAll = Record<string, { filePath: string; exportValue: unknown }[]>
async function loadPageFilesClientSide(pageFilesAll: PageFile3[], pageId: string) {
  const pageFiles = findPageFiles2(pageFilesAll, pageId, true)
  await Promise.all(pageFiles.map((p) => p.loadFileExports?.()))

  const pageExports: Record<string, unknown> = {}
  const exports: Record<string, unknown> = {}
  const exportsAll: ExportsAll = {}
  pageFiles.forEach((pageFile) => {
    Object.entries(pageFile.fileExports ?? {}).forEach(([exportName, exportValue]) => {
      exports[exportName] = exports[exportName] ?? exportValue
      if (pageFile.fileType === '.page') {
        pageExports[exportName] = pageExports[exportName] ?? exportValue
      }
      exportsAll[exportName] = exportsAll[exportName] ?? []
      exportsAll[exportName]!.push({
        filePath: pageFile.filePath,
        exportValue,
      })
    })
  })

  const pageContextAddendum = {
    exports,
    exportsAll,
    pageExports,
  }
  return pageContextAddendum
}

function findPageFiles2(pageFilesAll: PageFile3[], pageId: string, isForClientSide: boolean) {
  const fileTypeEnvSpecific = isForClientSide ? ('.page.client' as const) : ('.page.server' as const)
  const defaultFiles = [
    ...pageFilesAll.filter((p) => p.isDefaultPageFile && p.fileType === '.page'),
    ...pageFilesAll.filter((p) => p.isDefaultPageFile && p.fileType === fileTypeEnvSpecific),
  ]
  defaultFiles.sort(defaultFilesSorter(fileTypeEnvSpecific, pageId))
  const pageFiles = [
    ...pageFilesAll.filter((p) => p.pageId === pageId && p.fileType === fileTypeEnvSpecific),
    ...pageFilesAll.filter((p) => p.pageId === pageId && p.fileType === '.page'),
    ...defaultFiles,
  ]
  return pageFiles
}

// -1 => element1 first
// +1 => element2 first
function defaultFilesSorter(fileTypeEnvSpecific: FileType, pageId: string) {
  return (e1: PageFile3, e2: PageFile3): 0 | 1 | -1 => {
    assert(e1.isDefaultPageFile && e2.isDefaultPageFile)
    const d1 = getPathDistance(pageId, e1.filePath)
    const d2 = getPathDistance(pageId, e2.filePath)
    if (d1 !== d2) {
      return d1 < d2 ? -1 : 1
    } else {
      const isEnvSpecific1 = e1.fileType === fileTypeEnvSpecific
      const isEnvSpecific2 = e1.fileType === fileTypeEnvSpecific
      if (isEnvSpecific1 === isEnvSpecific2) {
        return 0
      }
      if (isEnvSpecific1) return -1
      if (isEnvSpecific2) return 1
      assert(false)
    }
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
