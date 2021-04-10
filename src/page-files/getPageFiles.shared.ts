import { assert, assertUsage, hasProp } from '../utils'

export { getPageFiles }
export { getPageFile }

export { setPageFiles }
export { setPageFilesAsync }

let allPageFiles: PageFiles | undefined

function setPageFiles(pageFiles: unknown) {
  assert(hasProp(pageFiles, '.page'))
  allPageFiles = pageFiles as PageFiles
}

let asyncSetter: () => Promise<unknown>
function setPageFilesAsync(_asyncSetter: () => Promise<unknown>) {
  asyncSetter = _asyncSetter
}

type PageFile = {
  filePath: string
  loadFile: () => Promise<Record<string, any>>
}
type FileType = '.page' | '.page.server' | '.page.route' | '.page.client'
type PageFiles = Record<FileType, Record<PageFile['filePath'], PageFile['loadFile']>>

async function getPageFiles(fileType: FileType): Promise<PageFile[]> {
  if (!allPageFiles && asyncSetter) {
    allPageFiles = (await asyncSetter()) as any
    assert(hasProp(allPageFiles, '.page'))
  }
  assert(hasProp(allPageFiles, '.page'))

  const pageFiles = Object.entries(allPageFiles[fileType]).map(([filePath, loadFile]) => {
    return { filePath, loadFile }
  })

  return pageFiles
}

async function getPageFile(fileType: FileType, pageId: string): Promise<null | PageFile> {
  const pageFiles = await getPageFiles(fileType)
  const pageFile = findPageFile(pageFiles, pageId)
  if (pageFile === null) {
    return null
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
