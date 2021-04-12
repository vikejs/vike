import { getPageFiles } from '../page-files/getPageFiles.shared'
import { isDefaultPageFile } from './is-default-page-file';
import { computePageId } from './compute-page-id';
import { PageId } from './types';
/**
  Returns the ID of all pages including `_error.page.*` but excluding `_default.page.*`.
*/
export async function getPageIds(): Promise<PageId[]> {
  const pageViewFiles = await getPageFiles('.page')
  let pageViewFilePaths = pageViewFiles.map(({ filePath }) => filePath)
  pageViewFilePaths = pageViewFilePaths.filter((filePath) => !isDefaultPageFile(filePath))

  let allPageIds = pageViewFilePaths.map(computePageId)
  return allPageIds
}