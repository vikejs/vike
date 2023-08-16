// TODO/v1-release: remove

export { getPageFileObject }
export type { PageFile }

import { determinePageIdOld } from '../determinePageIdOld.js'
import { assertPageFilePath } from '../assertPageFilePath.js'
import { isErrorPageId } from '../error-page.js'
import { assert, slice } from '../utils.js'
import { determineFileType, FileType } from './fileTypes.js'

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
    isErrorPageFile: isErrorPageId(filePath, false),
    pageId: determinePageIdOld(filePath)
  }
  return pageFile
}

function isDefaultFilePath(filePath: string): boolean {
  assertPageFilePath(filePath)
  if (isErrorPageId(filePath, false)) {
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
