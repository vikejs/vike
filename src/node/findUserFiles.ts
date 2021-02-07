import { FilePath, Html, PageId, PageServerConfig, PageView } from './types'
import { assert, assertUsage } from './utils/assert'
import { isCallable } from './utils/isCallable'

export { findUserFiles }
export { loadUserFile }
export { setFileFinder }
export { UserFiles }

type FileType = '.page' | '.server' | '.html' | '.browser'
type UserFiles = Record<FileType, Record<FilePath, FileExportsGetter>>
type Files = Record<FilePath, FileDefaultExportGetter>
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
function loadUserFile(
  fileType: '.server',
  filter: Filter
): Promise<PageServerConfig>
function loadUserFile(fileType: '.html', filter: Filter): Promise<Html>
function loadUserFile(
  fileType: '.browser',
  filter: Filter
): Promise<BrowserInit>
async function loadUserFile(
  fileType: FileType,
  filter: Filter
): Promise<FileDefaultExport> {
  const files = await findUserFiles(fileType)
  const fileGetter: FileDefaultExportGetter | null = findFile(files, filter)
  if (fileGetter === null) {
    return null
  }
  const fileDefaultExport = await fileGetter()
  return fileDefaultExport
}

function findUserFiles(
  fileType: '.page'
): Promise<Record<FilePath, () => Promise<PageView>>>
function findUserFiles(
  fileType: '.server'
): Promise<Record<FilePath, () => Promise<PageServerConfig>>>
function findUserFiles(
  fileType: '.html'
): Promise<Record<FilePath, () => Promise<Html>>>
function findUserFiles(
  fileType: '.browser'
): Promise<Record<FilePath, () => Promise<BrowserInit>>>
function findUserFiles(fileType: FileType): Promise<Files>
async function findUserFiles(fileType: FileType): Promise<Files> {
  const filesByType: UserFiles = await fileFinder()

  const filesWithExports: Record<FilePath, FileExportsGetter> =
    filesByType[fileType]
  let files: Record<FilePath, FileDefaultExportGetter>

  if (fileType === '.page') {
    files = mapExports(filesWithExports)
    return files
  }
  if (fileType === '.server') {
    files = mapExports(filesWithExports, (defaultExport, filePath) => {
      assertUsage(
        defaultExport.constructor === Object,
        `The default export of ${filePath} should be an object`
      )
    })
    return files
  }
  if (fileType === '.html') {
    files = mapExports(filesWithExports, (defaultExport, filePath) => {
      assertUsage(
        typeof defaultExport === 'string',
        `The default export of ${filePath} should be a string`
      )
    })
    return files
  }
  if (fileType === '.browser') {
    files = mapExports(filesWithExports, (defaultExport, filePath) => {
      assertUsage(
        isCallable(defaultExport),
        `The default export of ${filePath} should be a function`
      )
    })
    return files
  }
  assert(false)
}

function mapExports(
  files: Record<FilePath, FileExportsGetter>,
  assertDefaultExport?: (
    fileDefaultExport: FileDefaultExport,
    filePath: FilePath
  ) => void
): Record<FilePath, FileDefaultExportGetter> {
  return mapObject(
    files,
    (filePath: FilePath, fileExportsGetter: FileDefaultExportGetter) => {
      return async () => {
        const fileExports = await fileExportsGetter()
        assertUsage(
          'default' in fileExports,
          `${filePath} should have a default export`
        )
        assertUsage(
          fileExports.default,
          `The default export of ${filePath} is \`${fileExports.default}\``
        )
        if (assertDefaultExport) {
          assertDefaultExport(fileExports.default, filePath)
        }
        return fileExports.default
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

function findFile<T>(files: Record<FilePath, T>, filter: Filter): T | null {
  let fileNames = Object.keys(files) as FilePath[]
  if ('pageId' in filter) {
    fileNames = fileNames.filter((fileName) =>
      fileName.startsWith(filter.pageId)
    )
    assertUsage(fileNames.length <= 1, 'Conflicting ' + fileNames.join(' '))
  }
  if ('defaultFile' in filter) {
    assert(filter.defaultFile === true)
    fileNames = fileNames.filter(
      (fileName) =>
        fileName.includes('/default.') || fileName.includes('default.')
    )
    assertUsage(fileNames.length === 1, 'TODO')
  }
  if (fileNames.length === 0) {
    return null
  }
  assert(fileNames.length === 1)
  const fileName = fileNames[0]
  return files[fileName]
}
