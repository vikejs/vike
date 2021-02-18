import { assertUsage } from '../utils/assert'

export { getUserFiles }
export { getUserFile }

export { setFileFinder }

type FileType = '.page' | '.server' | '.route' | '.browser'
type UserFile = {
  filePath: string
  loadFile: () => Promise<Record<string, any>>
}

async function getUserFiles(fileType: FileType): Promise<UserFile[]> {
  const userFiles_byType: Record<
    UserFile['filePath'],
    UserFile['loadFile']
  > = await fileFinder()
  const userFiles = Object.entries(userFiles_byType[fileType]).map(
    ([filePath, loadFile]) => {
      return { filePath, loadFile }
    }
  )
  return userFiles
}

async function getUserFile(
  fileType: FileType,
  pageId: string
): Promise<null | UserFile> {
  const userFiles = await getUserFiles(fileType)
  const userFile = getPageFile(userFiles, pageId)
  if (userFile === null) {
    return null
  }
  return userFile
}

let fileFinder: any
function setFileFinder(fileFinder_: any): void {
  fileFinder = fileFinder_
}

function getPageFile<T>(
  userFiles: { filePath: string; loadFile: T }[],
  pageId: string
): { filePath: string; loadFile: T } | null {
  userFiles = userFiles.filter(({ filePath }) => filePath.startsWith(pageId))
  if (userFiles.length === 0) {
    return null
  }
  assertUsage(
    userFiles.length === 1,
    'Conflicting ' + userFiles.map(({ filePath }) => filePath).join(' ')
  )
  return userFiles[0]
}
