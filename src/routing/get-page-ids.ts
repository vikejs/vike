import { getPageFiles } from '../page-files/getPageFiles.shared'
import { computePageId } from './compute-page-id';
import { PageId } from './types';
import { assert, assertUsage } from '../utils';
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

function isDefaultPageFile(filePath: string): boolean {
  assert(!filePath.includes('\\'))
  if (!filePath.includes('/_default')) {
    return false
  }
  assertUsage(
    filePath.includes('_default.page.client.') || filePath.includes('_default.page.server.'),
    `\`_default.*\` file should be either \`_default.page.client.*\` or \`_default.page.server.*\` but we got: ${filePath}`
  )
  return true
}