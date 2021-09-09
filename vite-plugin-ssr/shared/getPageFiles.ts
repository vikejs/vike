import { getSsrEnv } from '../node/ssrEnv'
import { assert, assertUsage, hasProp, isBrowser } from './utils'

export type { AllPageFiles }
export type { PageFile }
export { getAllPageFiles_clientSide }
export { getAllPageFiles_serverSide }
export { findPageFile }
export { findDefaultFiles }

export { setPageFiles }
export { setPageFilesAsync }
export { isPageFilesSet }

assertNotAlreadyLoaded()

let allPageFilesUnprocessed: AllPageFilesUnproccessed | undefined

function setPageFiles(pageFiles: unknown) {
  assert(hasProp(pageFiles, '.page'))
  allPageFilesUnprocessed = pageFiles as AllPageFilesUnproccessed
}
function isPageFilesSet() {
  return !!allPageFilesUnprocessed
}

let asyncSetter: () => Promise<unknown>
function setPageFilesAsync(_asyncSetter: () => Promise<unknown>) {
  asyncSetter = _asyncSetter
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
  '.page': PageFileUnprocessed
  '.page.server': PageFileUnprocessed | undefined
  '.page.route': PageFileUnprocessed
  '.page.client': PageFileUnprocessed
}
/*/
type AllPageFilesUnproccessed = Record<FileType, PageFileUnprocessed>
//*/

type AllPageFiles = Record<FileType, PageFile[]>
type AllPageFiles_clientSide = Omit<AllPageFiles, '.page.server'>

async function getAllPageFiles_clientSide(): Promise<AllPageFiles_clientSide> {
  return await getAllPageFiles()
}
async function getAllPageFiles_serverSide(): Promise<AllPageFiles> {
  const allPageFiles = await getAllPageFiles()
  assert(allPageFiles['.page.server'] !== undefined)
  assert(hasProp(allPageFiles, '.page.server', 'array'))
  return allPageFiles
}

async function getAllPageFiles() {
  if (asyncSetter) {
    const ssrEnv = getSsrEnv()
    if (
      !allPageFilesUnprocessed ||
      // We reload glob imports in dev to make auto-reload works
      !ssrEnv.isProduction
    ) {
      allPageFilesUnprocessed = (await asyncSetter()) as any
    }
    assert(hasProp(allPageFilesUnprocessed, '.page'))
  }
  assert(hasProp(allPageFilesUnprocessed, '.page'))

  const tranform = (pageFiles: PageFileUnprocessed): PageFile[] => {
    return Object.entries(pageFiles).map(([filePath, loadFile]) => {
      return { filePath, loadFile }
    })
  }
  const allPageFiles = {
    '.page': tranform(allPageFilesUnprocessed['.page']),
    '.page.route': tranform(allPageFilesUnprocessed['.page.route']),
    '.page.server': !allPageFilesUnprocessed['.page.server']
      ? undefined
      : tranform(allPageFilesUnprocessed['.page.server']),
    '.page.client': tranform(allPageFilesUnprocessed['.page.client'])
  }

  return allPageFiles
}

function findPageFile<T>(
  pageFiles: { filePath: string; loadFile: T }[],
  pageId: string
): { filePath: string; loadFile: T } | null {
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

function findDefaultFiles<T extends { filePath: string }>(pageFiles: T[]): T[] {
  const defaultFiles = pageFiles.filter(({ filePath }) => {
    assert(filePath.startsWith('/'))
    assert(!filePath.includes('\\'))
    return filePath.includes('/_default')
  })
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
