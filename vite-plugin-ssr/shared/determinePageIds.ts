import { assert, slice, unique } from './utils'

export { determinePageIds }

/**
  Returns the ID of all pages including `_error.page.*` but excluding `_default.page.*`.
*/
function determinePageIds(allPageFiles: { filePath: string; isDefaultFile: boolean }[]): string[] {
  const allPageIds = unique(computePageIds(allPageFiles))
  return allPageIds
}
function computePageIds(pageFiles: { filePath: string }[]): string[] {
  const fileIds = pageFiles
    .map(({ filePath }) => filePath)
    .filter((filePath) => !isDefaultPageFile(filePath))
    .map(computePageId)
  return fileIds
}
function computePageId(filePath: string): string {
  const pageSuffix = '.page.'
  const pageId = slice(filePath.split(pageSuffix), 0, -1).join(pageSuffix)
  assert(!pageId.includes('\\'))
  return pageId
}
function isDefaultPageFile(filePath: string): boolean {
  assert(!filePath.includes('\\'))
  if (!filePath.includes('/_default')) {
    return false
  }
  return true
}
