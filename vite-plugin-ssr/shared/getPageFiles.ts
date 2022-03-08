export { loadPageFilesClientSide }
export type PageContextPageFiles = Awaited<ReturnType<typeof loadPageFilesClientSide>>
export type { PageFileLoaded }
export type { PageFilesMetaServer }
export { getPageIds }

export { loadPageFilesServerMeta }
export { isPageFileForPageId }

import {
  assert,
  assertUsage,
  getPathDistance,
  hasProp,
  isBrowser,
  isCallable,
  isObject,
  notNull,
  assertPosixPath,
  cast,
  slice,
  unique
} from './utils'

export type { AllPageFiles }
export type { PageFile }
export { findPageFile }
export { findDefaultFile }

export { setPageFilesServerSide }
export { setPageFilesClientSide }
export { setPageFilesServerSideAsync }

assertNotAlreadyLoaded()

let _pageFiles: PageFile3[] | undefined
let _pageFilesGetter: () => Promise<void> | undefined

function setPageFilesServerSide(pageFilesExports: unknown) {
  _pageFiles = format(pageFilesExports)
}
function setPageFilesServerSideAsync(getPageFilesExports: () => Promise<unknown>) {
  _pageFilesGetter = async () => {
    setPageFilesClientSide(await getPageFilesExports())
  }
}
function setPageFilesClientSide(pageFilesExports: unknown) {
  _pageFiles = format(pageFilesExports)
}

async function getPageFilesAllServerSide(pageContext: { _isProduction: boolean }) {
  if (!_pageFiles) {
    _pageFilesGetter
  }
  if (_pageFilesGetter) {
    if (
      !_pageFiles ||
      // We reload all glob imports in dev to make auto-reload work
      !pageContext._isProduction
    ) {
      await _pageFilesGetter()
    }
    assert(_pageFiles)
  }
  assert(_pageFiles)
  return _pageFiles
}

function getPageFilesAllClientSide() {
  assert(_pageFiles)
  return _pageFiles
}

type PageFile3 = {
  filePath: string
  fileType: FileType
  fileExports?: Record<string, unknown>
  loadFileExports?: () => Promise<void>
  meta?: Record<string, unknown>
  loadMeta?: () => Promise<void>
  isDefaultFile: boolean
}

function format(pageFilesExports: unknown) {
  assert(hasProp(pageFilesExports, 'isGeneratedFile'), 'Missing `isGeneratedFile`.')
  assert(pageFilesExports.isGeneratedFile === true, `\`isGeneratedFile === ${pageFilesExports.isGeneratedFile}\``)
  assert(hasProp(pageFilesExports, 'pageFiles', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesMeta', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesMetaEager', 'object'))
  assert(hasProp(pageFilesExports.pageFiles, '.page'))
  assert(hasProp(pageFilesExports.pageFiles, '.page.route'))
  assert(hasProp(pageFilesExports.pageFiles, '.page.client') || hasProp(pageFilesExports.pageFiles, '.page.server'))
  const pageFilesMap: Record<string, PageFile3> = {}
  Object.entries(pageFilesExports.pageFiles).forEach(([fileType, files]) => {
    cast<FileType>(fileType)
    assert(fileTypes.includes(fileType))
    assert(isObject(files))
    Object.entries(files).forEach(([filePath, loadModule]) => {
      assert(isCallable(loadModule))
      cast<() => Promise<Record<string, unknown>>>(loadModule)
      const pageFile: PageFile3 = (pageFilesMap[filePath] = {
        filePath,
        fileType,
        isDefaultFile: isDefaultPageFile(filePath)
      })
      pageFile.loadFileExports = async () => {
        pageFile.fileExports = await loadModule()
      }
    })
  })
  Object.entries(pageFilesExports.pageFilesMeta).forEach(([fileType, files]) => {
    cast<FileType>(fileType)
    assert(fileTypes.includes(fileType))
    assert(isObject(files))
    Object.entries(files).forEach(([filePath, loadModule]) => {
      assert(isCallable(loadModule))
      cast<() => Promise<Record<string, unknown>>>(loadModule)
      const pageFile = (pageFilesMap[filePath] = pageFilesMap[filePath] ?? {
        filePath,
        fileType,
        isDefaultFile: isDefaultPageFile(filePath)
      })
      pageFile.loadMeta = async () => {
        pageFile.meta = await loadModule()
      }
    })
  })
  Object.entries(pageFilesExports.pageFilesMetaEager).forEach(([fileType, files]) => {
    cast<FileType>(fileType)
    assert(fileTypes.includes(fileType))
    assert(isObject(files))
    Object.entries(files).forEach(([filePath, moduleExports]) => {
      assert(isObject(moduleExports))
      const pageFile = (pageFilesMap[filePath] = pageFilesMap[filePath] ?? {
        filePath,
        fileType,
        isDefaultFile: isDefaultPageFile(filePath)
      })
      pageFile.meta = moduleExports
    })
  })
  const pageFiles = Object.values(pageFilesMap)
  return pageFiles
}

type PageFile = {
  filePath: string
  loadFile: () => Promise<Record<string, unknown>>
}
const fileTypes = ['.page', '.page.server', '.page.route', '.page.client'] as const
type FileType = typeof fileTypes[number]

type AllPageFiles = Record<FileType, PageFile[]>

function findPageFile<T extends { filePath: string }>(pageFiles: T[], pageId: string): T | null {
  pageFiles = pageFiles.filter((p) => isPageIdFile(p, pageId))
  if (pageFiles.length === 0) {
    return null
  }
  assertUsage(pageFiles.length === 1, 'Conflicting ' + pageFiles.map(({ filePath }) => filePath).join(' '))
  const pageFile = pageFiles[0]
  assert(pageFile)
  return pageFile
}
function findPageFile2(pageFilesAll: PageFile3[], fileType: FileType, pageId: string): PageFile3 | null {
  const pageFiles = pageFilesAll.filter((p) => p.fileType===fileType && isPageIdFile(p, pageId))
  if (pageFiles.length === 0) {
    return null
  }
  assertUsage(pageFiles.length === 1, 'Conflicting ' + pageFiles.map(({ filePath }) => filePath).join(' '))
  const pageFile = pageFiles[0]
  assert(pageFile)
  return pageFile
}

function isPageIdFile(pageFile: { filePath: string }, pageId: string): boolean {
  const { filePath } = pageFile
  assertPosixPath(filePath)
  assertPosixPath(pageId)
  assert(filePath.startsWith('/'))
  assert(pageId.startsWith('/'))
  return filePath.startsWith(`${pageId}.page.`)
}

/*
function isDefaultFile(pageFile: { filePath: string }): boolean {
  const { filePath } = pageFile
  assertPosixPath(filePath)
  assert(filePath.startsWith('/'))
  return filePath.includes('/_default')
}
*/
function isDefaultPageFile(filePath: string): boolean {
  assertPosixPath(filePath)
  assert(filePath.startsWith('/'))
  return filePath.includes('/_default')
}
function findDefaultFiles2(pageFilesAll: PageFile3[], fileType: FileType): PageFile3[] {
  const defaultFiles =
  pageFilesAll
    .filter(p => p.fileType===fileType && p.isDefaultFile)
    .map((pageFile) => ({ ...pageFile, fileType, isDefaultFile: true }))
  return defaultFiles
}

function assertNotAlreadyLoaded() {
  // The functionality of this file will fail if it's loaded more than
  // once; we assert that it's loaded only once.
  const alreadyLoaded = Symbol()
  const globalObject: any = isBrowser() ? window : global
  assert(!globalObject[alreadyLoaded])
  globalObject[alreadyLoaded] = true
}

type PageFileLoaded = {
  filePath: string
  fileExports: Record<string, unknown>
  fileType: FileType
  isDefaultFile: boolean
}
type ExportName = string
type ExportsAll = Record<ExportName, ({filePath: string, exportValue: unknown })[]>
async function loadPageFilesClientSide(pageContext: { _pageId: string }) {
  const pageFilesAll = getPageFilesAllClientSide()

  const { pageFiles, mainPageFile } = findPageFiles2(pageFilesAll, pageContext._pageId, true)
  await Promise.all(pageFiles.map(p => p.loadFileExports?.()))

  const pageExports = pageFiles.find(({ filePath }) => filePath === mainPageFile?.filePath)?.fileExports ?? {}
  const exports: Record<ExportName, unknown> = {}
  const exportsAll: ExportsAll = {}
  pageFiles.forEach((pageFile) => {
    Object.entries(pageFile.fileExports??{}).forEach(([exportName, exportValue]) => {
      exports[exportName] = exports[exportName] ?? exportValue
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
    _pageFilesLoaded: pageFiles,
    _pageFilesAll: pageFilesAll,
  }
  return pageContextAddendum
}

function findPageFiles2(
  pageFilesAll: PageFile3[],
  pageId: string,
  isForClientSide: boolean,
): { pageFiles: PageFile3[]; mainPageFile: PageFile3 | null } {
  const fileTypeEnvSpecific = isForClientSide ? ('.page.client' as const) : ('.page.server' as const)
  const defaultFiles = [
    ...pageFilesAll.filter(p => p.isDefaultFile && p.fileType==='.page'),
    ...pageFilesAll.filter(p => p.isDefaultFile && p.fileType===fileTypeEnvSpecific),
  ]
  defaultFiles.sort(defaultFilesSorter(fileTypeEnvSpecific, pageId))
  const mainPageFile = findPageFile2(pageFilesAll, '.page', pageId)
  const pageFiles = [findPageFile2(pageFilesAll, fileTypeEnvSpecific, pageId), mainPageFile, ...defaultFiles].filter(
    notNull,
  )
  return { pageFiles, mainPageFile }
}

// -1 => element1 first
// +1 => element2 first
function defaultFilesSorter(fileTypeEnvSpecific: FileType, pageId: string) {
  return (e1: PageFile3, e2: PageFile3): 0 | 1 | -1 => {
    assert(e1.isDefaultFile && e2.isDefaultFile)
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

async function loadPageFilesServerMeta() {
  const pageFilesAll = getPageFilesAllClientSide()
  const fileType = '.page.server'
  await Promise.all(
    allPageFiles[fileType].map((p) => loadPageFile({ ...p, fileType, isDefaultFile: isDefaultFile(p) })),
  )
  return pageFilesServerMeta
}
function isPageFileForPageId(pageFile: { filePath: string }, pageId: string) {
  return isDefaultFile(pageFile) || isPageIdFile(pageFile, pageId)
}

async function loadPageFile(pageFile: PageFile3): Promise<PageFileLoaded> {
  const { filePath, loadFileExports, fileType, isDefaultFile } = pageFile
  const fileExports = await loadFileExports()
}

async function getPageIds(): string[] {
  const pageFilesAll = getPageFilesAllClientSide()
  determinePageIds
}

type PageFilesMetaServer = {
  '.page.client': Record<string, { exportNames: string[] }>
}


export { determinePageIds }

/**
  Returns the ID of all pages including `_error.page.*` but excluding `_default.page.*`.
*/
function determinePageIds(allPageFiles: AllPageFiles): string[] {
  const pageFileIds = computePageIds(allPageFiles['.page'])
  const pageClientFileIds = computePageIds(allPageFiles['.page.client'])
  const pageServerFileIds = computePageIds(allPageFiles['.page.server'])

  const allPageIds = unique([...pageFileIds, ...pageClientFileIds, ...pageServerFileIds])

  allPageIds.forEach((pageId) => {
    assertUsage(
      pageFileIds.includes(pageId) || pageServerFileIds.includes(pageId),
      `File missing. You need to create at least \`${pageId}.page.server.js\` or \`${pageId}.page.js\`.`,
    )
    assertUsage(
      pageFileIds.includes(pageId) || pageClientFileIds.includes(pageId),
      `File missing. You need to create at least \`${pageId}.page.client.js\` or \`${pageId}.page.js\`.`,
    )
  })

  return allPageIds
}
function computePageIds(pageFiles: PageFile[]): string[] {
  const fileIds = pageFiles
    .map(({ filePath }) => filePath)
    .filter((filePath) => !isDefaultPageFile(filePath))
    .map(computePageId)
  return fileIds
}
function computePageId(filePath: string): string {
  const pageSuffix = '.page.'
  const pageId = slice(filePath.split(pageSuffix), 0, -1).join(pageSuffix)
  assert(!pageId.includes('\\'))
  return pageId
}
function isDefaultPageFile(filePath: string): boolean {
  assert(!filePath.includes('\\'))
  if (!filePath.includes('/_default')) {
    return false
  }
  return true
}
