import { assertUsage } from '../utils'
import { getAllUserFiles, FileType } from './infra.shared'

export { getPageFiles }
export { getPageFile }

type PageFile = {
  filePath: string
  loadFile: () => Promise<Record<string, any>>
}

type PageFiles = Record<FileType, Record<PageFile['filePath'], PageFile['loadFile']>>

async function getPageFiles(fileType: FileType): Promise<PageFile[]> {
  const allPageFiles: PageFiles = await getAllUserFiles()

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
