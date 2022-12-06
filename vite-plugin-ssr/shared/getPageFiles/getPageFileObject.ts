export { getPageFileObject }
export type { PageFile }

import { determinePageId } from '../determinePageId'
import { assertPageFilePath } from '../assertPageFilePath'
import { isErrorPageId } from '../route'
import { assert, assertPosixPath, slice, isNpmPackageModule } from '../utils'
import type { FileType } from './fileTypes'
import { isScriptFile } from '../../utils/isScriptFile'

type PageFile = {
  filePath: string
  fileType: FileType
  isEnvFile: (env: 'client' | 'server' | 'isomph') => boolean // TODO: rename to `isClientOnly` + `isServerOnly`? (+ `isClientAndServer` if needed?) // rename to `isEnv` + rename `cient` => `CLIENT_ONLY`, `isomph` => `CLIENT+SERVER`
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
  const isEnvFile = (env: 'client' | 'server' | 'isomph'): boolean => {
    assert(fileType !== '.page.route') // We can't determine `.page.route.js`
    if (env === 'client') {
      return fileType === '.page.client' || fileType === '.css'
    }
    if (env === 'server') {
      return fileType === '.page.server'
    }
    if (env === 'isomph') {
      return fileType === '.page'
    }
    assert(false)
  }
  const pageFile = {
    filePath,
    fileType,
    isEnvFile,
    isRelevant,
    isDefaultPageFile: isDefaultFilePath(filePath),
    isRendererPageFile: fileType !== '.css' && isDefaultFilePath(filePath) && isRendererFilePath(filePath),
    isErrorPageFile: isErrorPageId(filePath),
    pageId: determinePageId(filePath)
  }
  return pageFile
}

function determineFileType(filePath: string): FileType {
  // TODO: Move to `fileType.ts`
  assertPosixPath(filePath)

  {
    const isCSS = filePath.endsWith('.css')
    assert(isScriptFile(filePath) || isCSS)
    if (isCSS) {
      assert(isNpmPackageModule(filePath), filePath) // `.css` page files are only supported for npm packages // TODO: consolidate this comment
      return '.css'
    }
  }

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
