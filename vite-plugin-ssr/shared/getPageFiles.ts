export { loadPageFiles2 }

import { assertPosixPath } from '../utils/filesystemPathHandling'
import { assert, assertUsage, getPathDistance, hasProp, isBrowser, lowerFirst, notNull } from './utils'

export type { AllPageFiles }
export type { PageFile }
export { getAllPageFiles }
export { findPageFile }
export { findPageFiles }
export { findDefaultFiles }
export { findDefaultFilesSorted }
export { findDefaultFile }

export { setPageFiles }
export { setPageFilesAsync }
export { isPageFilesSet }

assertNotAlreadyLoaded()

let allPageFilesUnprocessed: AllPageFilesUnproccessed | undefined

function setPageFiles(pageFiles: unknown) {
  assert(hasProp(pageFiles, 'isOriginalFile'), 'Missing isOriginalFile')
  assert(pageFiles.isOriginalFile === false, `\`isOriginalFile === ${pageFiles.isOriginalFile}\``)
  assert(hasProp(pageFiles, '.page'))
  allPageFilesUnprocessed = pageFiles as AllPageFilesUnproccessed
}
function isPageFilesSet() {
  return !!allPageFilesUnprocessed
}

let asyncGetter: () => Promise<unknown>
function setPageFilesAsync(getter: () => Promise<unknown>) {
  asyncGetter = getter
}

type PageFile = {
  filePath: string
  loadFile: () => Promise<Record<string, unknown>>
}
const fileTypes = ['.page', '.page.server', '.page.route', '.page.client'] as const
type FileType = typeof fileTypes[number]
type PageFileUnprocessed = Record<PageFile['filePath'], PageFile['loadFile']>
//*
type AllPageFilesUnproccessed = {
  isOriginalFile: false
  '.page': PageFileUnprocessed
  '.page.server': PageFileUnprocessed
  '.page.route': PageFileUnprocessed
  '.page.client': PageFileUnprocessed
}
/*/
type AllPageFilesUnproccessed = Record<FileType, PageFileUnprocessed>
//*/

type AllPageFiles = Record<FileType, PageFile[]>

async function getAllPageFiles(isProduction?: boolean): Promise<AllPageFiles> {
  if (asyncGetter) {
    if (
      !allPageFilesUnprocessed ||
      // We reload all glob imports in dev to make auto-reload work
      !isProduction
    ) {
      const pageFiles = (await asyncGetter()) as unknown
      setPageFiles(pageFiles)
    }
    assert(hasProp(allPageFilesUnprocessed, '.page'))
  }
  assert(hasProp(allPageFilesUnprocessed, '.page'))

  const allPageFiles = {
    '.page': processGlobResult(allPageFilesUnprocessed['.page']),
    '.page.route': processGlobResult(allPageFilesUnprocessed['.page.route']),
    '.page.server': processGlobResult(allPageFilesUnprocessed['.page.server']),
    '.page.client': processGlobResult(allPageFilesUnprocessed['.page.client']),
  }

  return allPageFiles
}

function processGlobResult(pageFiles: PageFileUnprocessed): PageFile[] {
  return Object.entries(pageFiles).map(([filePath, loadFile]) => {
    return { filePath, loadFile }
  })
}

function findPageFile<T extends { filePath: string }>(pageFiles: T[], pageId: string): T | null {
  pageFiles = pageFiles.filter(({ filePath }) => {
    assert(filePath.startsWith('/'))
    assert(pageId.startsWith('/'))
    assert(!filePath.includes('\\'))
    assert(!pageId.includes('\\'))
    return filePath.startsWith(`${pageId}.page.`)
  })
  if (pageFiles.length === 0) {
    return null
  }
  assertUsage(pageFiles.length === 1, 'Conflicting ' + pageFiles.map(({ filePath }) => filePath).join(' '))
  const pageFile = pageFiles[0]
  assert(pageFile)
  return pageFile
}
function findPageFile2(allPageFiles: AllPageFiles, fileType: FileType, pageId: string): PageFile2 | null {
  const pageFiles = allPageFiles[fileType].filter(({ filePath }) => {
    assertPosixPath(filePath)
    assertPosixPath(pageId)
    assert(filePath.startsWith('/'))
    assert(pageId.startsWith('/'))
    return filePath.startsWith(`${pageId}.page.`)
  })
  if (pageFiles.length === 0) {
    return null
  }
  assertUsage(pageFiles.length === 1, 'Conflicting ' + pageFiles.map(({ filePath }) => filePath).join(' '))
  const pageFile = pageFiles[0]
  assert(pageFile)
  return { ...pageFile, isDefaultFile: false, fileType }
}

function findPageFiles<T extends { filePath: string }>(allPageFiles: T[], pageId: string): T[] {
  const pageFiles = [findPageFile(allPageFiles, pageId), ...findDefaultFilesSorted(allPageFiles, pageId)].filter(
    notNull,
  )
  return pageFiles
}

function findDefaultFiles<T extends { filePath: string }>(pageFiles: T[]): T[] {
  const defaultFiles = pageFiles.filter(({ filePath }) => {
    assert(filePath.startsWith('/'))
    assert(!filePath.includes('\\'))
    return filePath.includes('/_default')
  })

  return defaultFiles
}
function findDefaultFiles2(allPageFiles: AllPageFiles, fileType: FileType): PageFile2[] {
  const defaultFiles = allPageFiles[fileType]
    .filter(({ filePath }) => {
      assert(filePath.startsWith('/'))
      assert(!filePath.includes('\\'))
      return filePath.includes('/_default')
    })
    .map((pageFile) => ({ ...pageFile, fileType, isDefaultFile: true }))

  return defaultFiles
}

function findDefaultFilesSorted<T extends { filePath: string }>(pageFiles: T[], pageId: string): T[] {
  const defaultFiles = findDefaultFiles(pageFiles)
  // Sort `_default.page.server.js` files by filesystem proximity to pageId's `*.page.js` file
  defaultFiles.sort(
    lowerFirst(({ filePath }) => {
      if (filePath.startsWith(pageId)) return -1
      return getPathDistance(pageId, filePath)
    }),
  )
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

function findDefaultFile<T extends { filePath: string }>(pageFiles: T[], pageId: string): T | null {
  const defaultFiles = findDefaultFilesSorted(pageFiles, pageId)
  return defaultFiles[0] || null
}

type PageFileLoaded = {
  filePath: string
  fileExports: Record<string, unknown>
  fileType: FileType
  isDefaultFile: boolean
}
type ExportName = string
async function loadPageFiles2(pageId: string, isBrowserSide: boolean) {
  const pageFilesAll = await getAllPageFiles()

  const exports: Record<ExportName, unknown> = {}
  const exportsAll: Record<ExportName, (PageFileLoaded & { exportValue: unknown })[]> = {}

  const { pageFiles, mainPageFile } = findPageFiles2(pageFilesAll, pageId, isBrowserSide)
  const pageFilesLoaded: PageFileLoaded[] = await Promise.all(
    pageFiles.map(async (pageFile) => {
      const { filePath, loadFile, fileType, isDefaultFile } = pageFile
      const fileExports = await loadFile()
      return {
        filePath,
        fileExports,
        fileType,
        isDefaultFile,
      }
    }),
  )
  const pageExports = pageFilesLoaded.find(({ filePath }) => filePath === mainPageFile?.filePath)?.fileExports ?? {}

  pageFilesLoaded.forEach((pageFile) => {
    Object.entries(pageFile.fileExports).forEach(([exportName, exportValue]) => {
      exports[exportName] = exports[exportName] ?? exportValue
      exportsAll[exportName] = exportsAll[exportName] ?? []
      exportsAll[exportName]!.push({
        ...pageFile,
        exportValue,
      })
    })
  })

  const pageContextAddendum = {
    exports,
    pageExports,
    exportsAll,
    _pageFilesLoaded: pageFilesLoaded,
    _pageFilesAll: pageFilesAll,
  }
  return pageContextAddendum
}

type PageFile2 = {
  filePath: string
  loadFile: () => Promise<Record<string, unknown>>
  fileType: FileType
  isDefaultFile: boolean
}

function findPageFiles2(
  allPageFiles: AllPageFiles,
  pageId: string,
  isBrowserSide: boolean,
): { pageFiles: PageFile2[]; mainPageFile: PageFile2 | null } {
  const fileTypeEnvSpecific = isBrowserSide ? ('.page.client' as const) : ('.page.server' as const)
  const defaultFiles = [
    ...findDefaultFiles2(allPageFiles, '.page'),
    ...findDefaultFiles2(allPageFiles, fileTypeEnvSpecific),
  ]
  defaultFiles.sort(defaultFilesSorter(fileTypeEnvSpecific, pageId))
  const mainPageFile = findPageFile2(allPageFiles, '.page', pageId)
  const pageFiles = [findPageFile2(allPageFiles, fileTypeEnvSpecific, pageId), mainPageFile, ...defaultFiles].filter(
    notNull,
  )
  return { pageFiles, mainPageFile }
}

// -1 => element1 first
// +1 => element2 first
function defaultFilesSorter(fileTypeEnvSpecific: FileType, pageId: string) {
  return (e1: PageFile2, e2: PageFile2): 0 | 1 | -1 => {
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
