import { getSsrEnv } from '../ssrEnv.node'
import { assert, assertUsage, hasProp, isNodejs } from '../utils'

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
  if (!pageFile) {
    const pageFilePaths = pageFiles.map(({ filePath }) => filePath)
    const debugInfo = { pageId, fileType, pageFilePaths }
    throw new Error(
      "[vite-plugin-ssr] You stumbled upon a known Vite error (cache invalidation). Reloading your page may solve the problem. If it doesn't, then remove the Vite cache `$ rm -r node_modules/.vite/` and try again. Please add a comment at https://github.com/brillout/vite-plugin-ssr/issues/109 and include this error stack trace and following debug info in your comment: " +
        JSON.stringify(debugInfo)
    )
  }
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
  const globalObject: any = isNodejs() ? global : window
  assert(!globalObject[alreadyLoaded])
  globalObject[alreadyLoaded] = true
}
