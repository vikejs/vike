import { getSsrEnv } from '../ssrEnv.node'
import { assert, assertUsage, hasProp } from '../utils'

export { getPageFiles }
export { getPageFile }
// export { PageFile }

export { setPageFiles }
export { setPageFilesAsync }
export { isPageFilesSet }

assertNotAlreadyLoaded()

let allPageFiles: PageFiles | undefined

function setPageFiles(pageFiles: unknown) {
  assert(hasProp(pageFiles, '.page'))
  allPageFiles = pageFiles as PageFiles
}
function isPageFilesSet() {
  return !!allPageFiles
}

let asyncSetter: () => Promise<unknown>
function setPageFilesAsync(_asyncSetter: () => Promise<unknown>) {
  asyncSetter = _asyncSetter
}

type PageFile = {
  filePath: string
  loadFile: () => Promise<Record<string, unknown>>
}
type FileType = '.page' | '.page.server' | '.page.route' | '.page.client'
type PageFiles = Record<FileType, Record<PageFile['filePath'], PageFile['loadFile']>>

async function getPageFiles(fileType: FileType): Promise<PageFile[]> {
  if (asyncSetter) {
    const ssrEnv = getSsrEnv()
    if (
      !allPageFiles ||
      // We reload glob imports in dev to make auto-reload works
      !ssrEnv.isProduction
    ) {
      allPageFiles = (await asyncSetter()) as any
    }
    assert(hasProp(allPageFiles, '.page'))
  }
  assert(hasProp(allPageFiles, '.page'))

  const pageFiles = Object.entries(allPageFiles[fileType]).map(([filePath, loadFile]) => {
    return { filePath, loadFile }
  })

  return pageFiles
}

async function getPageFile(fileType: FileType, pageId: string): Promise<PageFile> {
  assert(!pageId.includes('\\'))
  const pageFiles = await getPageFiles(fileType)
  const pageFile = findPageFile(pageFiles, pageId)
  const pageFilePaths = pageFiles.map(({ filePath }) => filePath)
  assert(pageFile, { pageId, pageFilePaths })
  return pageFile
}

function findPageFile<T>(
  pageFiles: { filePath: string; loadFile: T }[],
  pageId: string
): { filePath: string; loadFile: T } | null {
  pageFiles = pageFiles.filter(({ filePath }) => filePath.startsWith(`${pageId}.page.`))
  if (pageFiles.length === 0) {
    return null
  }
  assertUsage(pageFiles.length === 1, 'Conflicting ' + pageFiles.map(({ filePath }) => filePath).join(' '))
  return pageFiles[0]
}

function assertNotAlreadyLoaded() {
  // The functionality of this file will fail if it's loaded more than
  // once; we assert that it's loaded only once.
  const alreadyLoaded = Symbol()
  const globalObject: any = typeof window !== 'undefined' ? window : global
  assert(!globalObject[alreadyLoaded])
  globalObject[alreadyLoaded] = true
}
