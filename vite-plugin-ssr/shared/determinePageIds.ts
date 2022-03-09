import { assert, slice, unique } from './utils'

// TODO: remove `determinePageIds`?
export { determinePageIds }
export { determinePageId }

/**
  Returns the ID of all pages including `_error.page.*` but excluding `_default.page.*`.
*/
function determinePageIds(allPageFiles: { filePath: string; isDefaultPageFile: boolean }[]): string[] {
  const allPageIds = unique(computePageIds(allPageFiles))
  return allPageIds
}
function computePageIds(pageFiles: { filePath: string; isDefaultPageFile: boolean }[]): string[] {
  const fileIds = pageFiles
    .filter(({ isDefaultPageFile }) => !isDefaultPageFile)
    .map(({ filePath }) => filePath)
    .map(determinePageId)
  return fileIds
}
function determinePageId(filePath: string): string {
  const pageSuffix = '.page.'
  const pageId = slice(filePath.split(pageSuffix), 0, -1).join(pageSuffix)
  assert(!pageId.includes('\\'))
  return pageId
}
