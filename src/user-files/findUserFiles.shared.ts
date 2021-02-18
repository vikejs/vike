import { FilePathFromRoot, PageId, PageView } from '../types'
import { assert, assertUsage } from '../utils/assert'

export { getUserFiles }
export { getUserFile }

export { FileType }
export { findUserFiles2 }

export { findUserFiles }
export { loadUserFile }
export { findUserFilePath }
export { setFileFinder }
export { findFile }

type UserFile = {
  filePath: string
  loadFile: () => Promise<Record<string, any>>
}

async function getUserFiles(fileType: FileType): Promise<UserFile[]> {
  const userFiles_byType: UserFiles = await fileFinder()
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
  const userFile = findFile2(userFiles, pageId)
  if (userFile === null) {
    return null
  }
  return userFile
}

async function findUserFiles2(fileType: FileType) {
  const userFiles_byType: UserFiles = await fileFinder()
  const userFiles = userFiles_byType[fileType]
  return userFiles
}

type FileType = '.page' | '.server' | '.route' | '.browser'
type UserFiles = Record<FileType, Record<FilePathFromRoot, FileExportsGetter>>
type Files = Record<FilePathFromRoot, FileDefaultExportGetter>
type FileExportsGetter = () => Promise<FileExports>
type FileDefaultExportGetter = () => Promise<FileDefaultExport>
type FileExports = Record<string, any>
type FileDefaultExport = any
type InitialProps = Record<string, any>
type BrowserInit = ({
  pageView,
  initialProps
}: {
  pageView: PageView
  initialProps: InitialProps
}) => void | Promise<void>

let fileFinder: () => Promise<UserFiles>
function setFileFinder(fileFinder_: () => Promise<UserFiles>): void {
  fileFinder = fileFinder_
}

type Filter = { pageId: PageId } | { defaultFile: true }

function loadUserFile(fileType: '.page', filter: Filter): Promise<PageView>
function loadUserFile(fileType: '.server', filter: Filter): Promise<never>
function loadUserFile(
  fileType: '.browser',
  filter: Filter
): Promise<BrowserInit>
async function loadUserFile(
  fileType: FileType,
  filter: Filter
): Promise<FileDefaultExport> {
  const files = await findUserFiles(fileType)
  const file = findFile(files, filter)
  if (file === null) {
    return null
  }
  const fileDefaultExport = await file.fileGetter()
  return fileDefaultExport
}

async function findUserFilePath(
  fileType: FileType,
  filter: Filter
): Promise<FilePathFromRoot | null> {
  const files = await findUserFiles(fileType)
  const file = findFile(files, filter)
  if (file === null) {
    return null
  }
  const { filePath } = file
  return filePath
}

function findUserFiles(
  fileType: '.page'
): Promise<Record<FilePathFromRoot, () => Promise<PageView>>>
function findUserFiles(
  fileType: '.browser'
): Promise<Record<FilePathFromRoot, () => Promise<BrowserInit>>>
function findUserFiles(fileType: FileType): Promise<Files>
async function findUserFiles(fileType: FileType): Promise<Files> {
  const filesByType: UserFiles = await fileFinder()

  const filesWithAllExports: Record<FilePathFromRoot, FileExportsGetter> =
    filesByType[fileType]
  let files: Record<FilePathFromRoot, FileDefaultExportGetter>

  if (fileType === '.page') {
    files = mapExports(filesWithAllExports)
    return files
  }
  if (fileType === '.server') {
    files = mapExports(filesWithAllExports, {
      assertDefaultExport: (defaultExport, filePath) => {
        assertUsage(
          defaultExport.constructor === Object,
          `The default export of ${filePath} should be an object`
        )
      }
    })
    return files
  }
  if (fileType === '.browser') {
    files = mapExports(filesWithAllExports, { noExports: true })
    return files
  }
  assert(false)
}

function mapExports(
  files: Record<FilePathFromRoot, FileExportsGetter>,
  {
    assertDefaultExport,
    defaultExportGetter,
    noExports
  }: {
    assertDefaultExport?: (
      fileDefaultExport: FileDefaultExport,
      filePath: FilePathFromRoot
    ) => void
    defaultExportGetter?: (
      filePath: FilePathFromRoot
    ) => Promise<FileDefaultExport>
    noExports?: boolean
  } = {}
): Record<FilePathFromRoot, FileDefaultExportGetter> {
  return mapObject(
    files,
    (
      filePath: FilePathFromRoot,
      fileExportsGetter: FileDefaultExportGetter
    ) => {
      return async () => {
        if (defaultExportGetter) {
          const defaultExport = await defaultExportGetter(filePath)
          return defaultExport
        }
        const fileExports = await fileExportsGetter()
        if (noExports) {
          const exportNames = Object.keys(fileExports)
          assertUsage(
            exportNames.length === 0,
            [
              `${filePath} exports`,
              exportNames.map((s) => `\`${s}\``).join(', '),
              'but it should not export anything'
            ].join(' ')
          )
          return undefined
        }
        assertUsage(
          'default' in fileExports,
          `${filePath} should have a default export`
        )
        const defaultExport = fileExports.default
        assertUsage(
          defaultExport,
          `The default export of ${filePath} is \`${defaultExport}\``
        )
        if (assertDefaultExport) {
          assertDefaultExport(defaultExport, filePath)
        }
        return defaultExport
      }
    }
  )
}

function mapObject<Before, After>(
  obj: Record<string, Before>,
  transformer: (key: string, val: Before) => After
): Record<string, After> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]: [key: string, val: Before]) => {
      const newVal: After = transformer(key, val)
      return [key, newVal]
    })
  )
}

function findFile<T>(
  files: Record<FilePathFromRoot, T>,
  filter: Filter
): { filePath: FilePathFromRoot; fileGetter: T } | null {
  let filePaths = Object.keys(files) as FilePathFromRoot[]
  if ('pageId' in filter) {
    filePaths = filePaths.filter((filePath) =>
      filePath.startsWith(filter.pageId)
    )
    assertUsage(filePaths.length <= 1, 'Conflicting ' + filePaths.join(' '))
  }
  if ('defaultFile' in filter) {
    assert(filter.defaultFile === true)
    filePaths = filePaths.filter((filePath) => {
      assert(filePath.startsWith('/'))
      return filePath.includes('/default.')
    })
    assertUsage(filePaths.length === 1, 'TODO')
  }
  if (filePaths.length === 0) {
    return null
  }
  assert(filePaths.length === 1)
  const filePath = filePaths[0]
  const fileGetter = files[filePath]
  return { filePath, fileGetter }
}

function findFile2<T>(
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
