export { getPageFileObject }

import { determinePageId } from '../determinePageId'
import { assertPageFilePath } from '../assertPageFilePath'
import { isErrorPageId } from '../route'
import { assert, assertPosixPath, slice } from '../utils'
import type { FileType, PageFile } from './types'
import { isScriptFile } from '../../utils/isScriptFile'

function getPageFileObject(filePath: string): PageFile {
  const isRelevant = (pageId: string): boolean =>
    pageFile.pageId === pageId ||
    (pageFile.isDefaultPageFile && (isRendererFilePath(pageFile.filePath) || isAncestorDefaultPage(pageId, pageFile.filePath)))
  const fileType = determineFileType(filePath)
  const pageFile = {
    filePath,
    fileType,
    isRelevant,
    isDefaultPageFile: isDefaultFilePath(filePath),
    isRendererPageFile: !isCSS(filePath) && isDefaultFilePath(filePath) && isRendererFilePath(filePath),
    isErrorPageFile: isErrorPageId(filePath),
    // isCSS: isCSS(filePath), // TODO: remove if not needed
    pageId: determinePageId(filePath)
  }
  return pageFile
}

function isCSS(filePath: string): boolean {
  const isCSS = filePath.endsWith('.css')
  assert(isScriptFile(filePath) || isCSS)
  return isCSS
}

function determineFileType(filePath: string): FileType {
  assertPosixPath(filePath)
  const fileName = filePath.split('/').slice(-1)[0]!
  const fileNameSegments = fileName.split('.')
  const suffix1 = fileNameSegments.slice(-3)[0]
  const suffix2 = fileNameSegments.slice(-2)[0]
  if (suffix2 === 'page') {
    return '.page'
  }
  assert(suffix1 === 'page', { filePath })
  if (suffix2 === 'server') {
    return '.page.server'
  }
  if (suffix2 === 'client') {
    return '.page.client'
  }
  if (suffix2 === 'route') {
    return '.page.route'
  }
  assert(false, { filePath })
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
