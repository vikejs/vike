export { determinePageFilesToLoad }

import type { FileType, PageFile } from './types'
import { assert, assertPosixPath } from '../utils'

function determinePageFilesToLoad(pageFilesAll: PageFile[], pageId: string, isForClientSide: boolean) {
  const fileTypeEnvSpecific = isForClientSide ? ('.page.client' as const) : ('.page.server' as const)
  const defaultFiles = [
    ...pageFilesAll.filter((p) => p.isDefaultPageFile && p.isRelevant(pageId) && p.fileType === fileTypeEnvSpecific),
    ...pageFilesAll.filter((p) => p.isDefaultPageFile && p.isRelevant(pageId) && p.fileType === '.page'),
  ]
  defaultFiles.sort(defaultFilesSorter(fileTypeEnvSpecific, pageId))
  const pageFiles = [
    ...pageFilesAll.filter((p) => p.pageId === pageId && p.fileType === fileTypeEnvSpecific),
    ...pageFilesAll.filter((p) => p.pageId === pageId && p.fileType === '.page'),
    ...defaultFiles,
  ]
  return pageFiles
}

function defaultFilesSorter(fileTypeEnvSpecific: FileType, pageId: string) {
  const e1First = -1 as const
  const e2First = +1 as const
  const noOrder = 0 as const
  return (e1: PageFile, e2: PageFile): 0 | 1 | -1 => {
    assert(e1.isDefaultPageFile && e2.isDefaultPageFile)

    {
      const e1_isRenderer = e1.isRendererPageFile
      const e2_isRenderer = e2.isRendererPageFile
      if (!e1_isRenderer && e2_isRenderer) {
        return e1First
      }
      if (!e2_isRenderer && e1_isRenderer) {
        return e2First
      }
      assert(e1_isRenderer === e2_isRenderer)
    }

    {
      const e1_distance = getPathDistance(pageId, e1.filePath)
      const e2_distance = getPathDistance(pageId, e2.filePath)
      if (e1_distance < e2_distance) {
        return e1First
      }
      if (e2_distance < e1_distance) {
        return e2First
      }
      assert(e1_distance === e2_distance)
    }

    {
      if (e1.fileType === fileTypeEnvSpecific && e2.fileType !== fileTypeEnvSpecific) {
        return e1First
      }
      if (e2.fileType === fileTypeEnvSpecific && e1.fileType !== fileTypeEnvSpecific) {
        return e2First
      }
    }

    /*
    {
      if (e1.fileType === '.page' && e2.fileType !== '.page') {
        return e2First
      }
      if (e2.fileType === '.page' && e1.fileType !== '.page') {
        return e1First
      }
    }
    */

    return noOrder
  }
}

function getPathDistance(pathA: string, pathB: string): number {
  assertPosixPath(pathA)
  assertPosixPath(pathB)
  assert(pathA.startsWith('/'))
  assert(pathB.startsWith('/'))

  // Index of first different character
  let idx = 0
  for (; idx < pathA.length && idx < pathB.length; idx++) {
    if (pathA[idx] !== pathB[idx]) break
  }

  const pathAWithoutCommon = pathA.slice(idx)
  const pathBWithoutCommon = pathB.slice(idx)

  const distanceA = pathAWithoutCommon.split('/').length
  const distanceB = pathBWithoutCommon.split('/').length

  const distance = distanceA + distanceB

  return distance
}
