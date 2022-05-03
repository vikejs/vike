export { isHtmlOnlyPage }
export { getExportNames }
export { hasPageExport }

import type { PageFile } from './getPageFiles'
import { assert } from './utils'

// Returns true for pages that don't have a `render()` hook, or don't have a `Page` export
function isHtmlOnlyPage(pageId: string, pageFilesAll: PageFile[], isClientSide: boolean) {
  // All `.page.client.js` and .page.js` files relevant to `pageId`
  const pageFilesClientCandidates = pageFilesAll.filter(
    (p) => (p.fileType === '.page.client' || p.fileType === '.page') && p.isRelevant(pageId),
  )
  const hasPage = pageFilesClientCandidates.some((p) => hasPageExport(p, isClientSide))
  const hasRender = pageFilesClientCandidates.some((p) => getExportNames(p, isClientSide).includes('render'))
  const isHtmlOnly = !hasPage || !hasRender
  return { isHtmlOnly, pageFilesClientCandidates }
}

function getExportNames(pageFile: PageFile, isClientSide: boolean): string[] {
  if (pageFile.fileType === '.page.client') {
    // We assume `pageFile.loadExportNames()` was already called
    assert(pageFile.exportNames, pageFile.filePath)
    return pageFile.exportNames
  }
  if (pageFile.fileType === '.page') {
    if (pageFile.exportNames) {
      return pageFile.exportNames
    }
    // In order to not break HMR, the client-side should not retrieve the export names from `pageFile.fileExports`.
    if (!isClientSide && pageFile.fileExports) {
      return Object.keys(pageFile.fileExports)
    }
    assert(false, pageFile.filePath)
  }
  assert(false)
}

function hasPageExport(pageFile: PageFile, isClientSide: boolean): boolean {
  const exportNames = getExportNames(pageFile, isClientSide)
  return exportNames.includes('default') || exportNames.includes('Page')
}
