import { AllPageFiles, PageFile } from './getPageFiles'
import { assert, assertUsage, slice, unique } from './utils'

export { determinePageIds }

/**
  Returns the ID of all pages including `_error.page.*` but excluding `_default.page.*`.
*/
async function determinePageIds(allPageFiles: AllPageFiles): Promise<string[]> {
  const pageFileIds = computePageIds(allPageFiles['.page'])
  const pageClientFileIds = computePageIds(allPageFiles['.page.client'])
  const pageServerFileIds = computePageIds(allPageFiles['.page.server'])

  const allPageIds = unique([...pageFileIds, ...pageClientFileIds, ...pageServerFileIds])

  allPageIds.forEach((pageId) => {
    assertUsage(
      pageFileIds.includes(pageId) || pageServerFileIds.includes(pageId),
      `File missing. You need to create at least \`${pageId}.page.server.js\` or \`${pageId}.page.js\`.`,
    )
    assertUsage(
      pageFileIds.includes(pageId) || pageClientFileIds.includes(pageId),
      `File missing. You need to create at least \`${pageId}.page.client.js\` or \`${pageId}.page.js\`.`,
    )
  })

  return allPageIds
}
function computePageIds(pageFiles: PageFile[]): string[] {
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
