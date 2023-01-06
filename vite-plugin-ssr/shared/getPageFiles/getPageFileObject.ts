export { getPageFileObject }
export type { PageFile }
export type { PageConfigFile }
export type { PageConfig }

import { determinePageId } from '../determinePageId'
import { assertPageFilePath } from '../assertPageFilePath'
import { isErrorPageId } from '../route'
import { assert, slice } from '../utils'
import { determineFileType, FileType } from './fileTypes'

type PageFile = {
  filePath: string
  fileType: FileType
  isEnv: (env: 'CLIENT_ONLY' | 'SERVER_ONLY' | 'CLIENT_AND_SERVER') => boolean
  fileExports?: Record<string, unknown>
  loadFile?: () => Promise<void>
  exportNames?: string[]
  loadExportNames?: () => Promise<void>
  isRelevant: (pageId: string) => boolean
  isDefaultPageFile: boolean
  isRendererPageFile: boolean
  isErrorPageFile: boolean
  pageId: string
}

type PageConfig = {
  onRenderHtml?: string | Function
  onRenderClient?: string | Function
  Page?: string | unknown
} & Record<string, unknown>
type PageConfigFile = {
  filePath: string
  getPageConfig: () => Promise<PageConfig>
  /*
  filesystemId: string
  loadConfig: () => Promise<void>
  configValue?: Record<string, unknown>
  */
}

function getPageFileObject(filePath: string): PageFile {
  const isRelevant = (pageId: string): boolean =>
    pageFile.pageId === pageId ||
    (pageFile.isDefaultPageFile &&
      (isRendererFilePath(pageFile.filePath) || isAncestorDefaultPage(pageId, pageFile.filePath)))
  const fileType = determineFileType(filePath)
  const isEnv = (env: 'CLIENT_ONLY' | 'SERVER_ONLY' | 'CLIENT_AND_SERVER'): boolean => {
    assert(fileType !== '.page.route') // We can't determine `.page.route.js`
    if (env === 'CLIENT_ONLY') {
      return fileType === '.page.client' || fileType === '.css'
    }
    if (env === 'SERVER_ONLY') {
      return fileType === '.page.server'
    }
    if (env === 'CLIENT_AND_SERVER') {
      return fileType === '.page'
    }
    assert(false)
  }
  const pageFile = {
    filePath,
    fileType,
    isEnv,
    isRelevant,
    isDefaultPageFile: isDefaultFilePath(filePath),
    isRendererPageFile: fileType !== '.css' && isDefaultFilePath(filePath) && isRendererFilePath(filePath),
    isErrorPageFile: isErrorPageId(filePath),
    pageId: determinePageId(filePath)
  }
  return pageFile
}

function isDefaultFilePath(filePath: string): boolean {
  assertPageFilePath(filePath)
  if (isErrorPageId(filePath)) {
    return false
  }
  return filePath.includes('/_default')
}

function isRendererFilePath(filePath: string): boolean {
  assertPageFilePath(filePath)
  return filePath.includes('/renderer/')
}

function isAncestorDefaultPage(pageId: string, defaultPageFilePath: string) {
  assertPageFilePath(pageId)
  assertPageFilePath(defaultPageFilePath)
  assert(!pageId.endsWith('/'))
  assert(!defaultPageFilePath.endsWith('/'))
  assert(isDefaultFilePath(defaultPageFilePath))

  const defaultPageDir = slice(defaultPageFilePath.split('/'), 0, -1)
    .filter((filePathSegment) => filePathSegment !== '_default')
    .join('/')
  return pageId.startsWith(defaultPageDir)
}
