export { parseGlobResults }

import { determinePageId } from '../determinePageId'
import { isErrorPage } from '../route'
import { assert, hasProp, isCallable, isObject, assertPosixPath, cast, slice } from '../utils'
import { FileType, fileTypes, PageFile } from './types'

function parseGlobResults(pageFilesExports: unknown) {
  assert(hasProp(pageFilesExports, 'isGeneratedFile'), 'Missing `isGeneratedFile`.')
  assert(pageFilesExports.isGeneratedFile !== false, `vite-plugin-ssr was re-installed(/re-built). Restart your app.`)
  assert(pageFilesExports.isGeneratedFile === true, `\`isGeneratedFile === ${pageFilesExports.isGeneratedFile}\``)
  assert(hasProp(pageFilesExports, 'pageFilesLazy', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesEager', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesExportNamesLazy', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesExportNamesEager', 'object'))
  assert(hasProp(pageFilesExports.pageFilesLazy, '.page'))
  assert(
    hasProp(pageFilesExports.pageFilesLazy, '.page.route') || hasProp(pageFilesExports.pageFilesEager, '.page.route'),
  )
  assert(
    hasProp(pageFilesExports.pageFilesLazy, '.page.client') || hasProp(pageFilesExports.pageFilesLazy, '.page.server'),
  )

  const pageFilesMap: Record<string, PageFile> = {}
  traverse(pageFilesExports.pageFilesLazy, pageFilesMap, (pageFile, globResult) => {
    const loadModule = globResult
    assertLoadModule(loadModule)
    pageFile.loadFile = async () => {
      if (!('fileExports' in pageFile)) {
        pageFile.fileExports = await loadModule()
      }
    }
  })
  traverse(pageFilesExports.pageFilesExportNamesLazy, pageFilesMap, (pageFile, globResult) => {
    const loadModule = globResult
    assertLoadModule(loadModule)
    pageFile.loadExportNames = async () => {
      if (!('exportNames' in pageFile)) {
        const moduleExports = await loadModule()
        assert(hasProp(moduleExports, 'exportNames', 'string[]'), pageFile.filePath)
        pageFile.exportNames = moduleExports.exportNames
      }
    }
  })
  traverse(pageFilesExports.pageFilesEager, pageFilesMap, (pageFile, globResult) => {
    const moduleExports = globResult
    assert(isObject(moduleExports))
    pageFile.fileExports = moduleExports
  })
  traverse(pageFilesExports.pageFilesExportNamesEager, pageFilesMap, (pageFile, globResult) => {
    const moduleExports = globResult
    assert(isObject(moduleExports))
    assert(hasProp(moduleExports, 'exportNames', 'string[]'), pageFile.filePath)
    pageFile.exportNames = moduleExports.exportNames
  })

  const pageFiles = Object.values(pageFilesMap)
  pageFiles.forEach(({ filePath }) => {
    assert(!filePath.includes('\\'))
  })

  return pageFiles
}

function assertLoadModule(globResult: unknown): asserts globResult is () => Promise<Record<string, unknown>> {
  assert(isCallable(globResult))
}
function traverse(
  globObject: Record<string, unknown>,
  pageFilesMap: Record<string, PageFile>,
  visitor: (pageFile: PageFile, globResult: unknown) => void,
) {
  Object.entries(globObject).forEach(([fileType, globFiles]) => {
    cast<FileType>(fileType)
    assert(fileTypes.includes(fileType))
    assert(isObject(globFiles))
    Object.entries(globFiles).forEach(([filePath, globResult]) => {
      const isRelevant = (pageId: string): boolean =>
        pageFile.pageId === pageId ||
        (pageFile.isDefaultPageFile &&
          (pageFile.isRendererPageFile || isAncestorDefaultPage(pageId, pageFile.filePath)))
      const pageFile = (pageFilesMap[filePath] = pageFilesMap[filePath] ?? {
        filePath,
        fileType,
        isRelevant,
        isDefaultPageFile: isDefaultFilePath(filePath),
        isRendererPageFile: isDefaultFilePath(filePath) && isRendererFilePath(filePath),
        isErrorPageFile: isErrorPage(filePath),
        pageId: determinePageId(filePath),
      })
      visitor(pageFile, globResult)
    })
  })
}

function isDefaultFilePath(filePath: string): boolean {
  assertPosixPath(filePath)
  assert(filePath.startsWith('/'))
  return filePath.includes('/_default')
}
function isRendererFilePath(filePath: string): boolean {
  assertPosixPath(filePath)
  assert(filePath.startsWith('/'))
  return filePath.includes('/renderer/')
}

function isAncestorDefaultPage(pageId: string, defaultPageFilePath: string) {
  assertPosixPath(pageId)
  assertPosixPath(defaultPageFilePath)
  assert(pageId.startsWith('/'))
  assert(defaultPageFilePath.startsWith('/'))
  assert(!pageId.endsWith('/'))
  assert(!defaultPageFilePath.endsWith('/'))
  assert(isDefaultFilePath(defaultPageFilePath))

  const defaultPageDir = slice(defaultPageFilePath.split('/'), 0, -1).join('/')
  return pageId.startsWith(defaultPageDir)
}
