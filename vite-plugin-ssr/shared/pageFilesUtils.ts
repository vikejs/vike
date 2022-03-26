export { isHtmlOnlyPage }
export { getExportNames }
export { hasPageExport }

import type { PageFile } from './getPageFiles'
import { assert, hasProp } from './utils'

function isHtmlOnlyPage(pageId: string, pageFilesAll: PageFile[]) {
  // The `.page.client.js`/`.page.js` files that should, potentially, be loaded in the browser
  const pageFilesClientCandidates = pageFilesAll.filter(
    (p) => (p.fileType === '.page.client' || p.fileType === '.page') && p.isRelevant(pageId),
  )
  const hasPage = pageFilesClientCandidates.some(hasPageExport)
  const hasRender = pageFilesClientCandidates.some((p) => getExportNames(p).includes('render'))
  const isHtmlOnly = !hasPage || !hasRender
  return { isHtmlOnly, pageFilesClientCandidates }
}

function getExportNames(pageFile: PageFile): string[] {
  if (pageFile.fileType === '.page.client') {
    // We assume `pageFile.loadExportNames()` was already called
    assert(hasProp(pageFile.meta, 'exportNames', 'string[]'), pageFile.filePath)
    return pageFile.meta.exportNames
  }
  if (pageFile.fileType === '.page') {
    if (pageFile.fileExports) {
      return Object.keys(pageFile.fileExports)
    }
    if (pageFile.meta) {
      assert(hasProp(pageFile.meta, 'exportNames', 'string[]'), pageFile.filePath)
      return pageFile.meta.exportNames
    }
    assert(false, pageFile.filePath)
  }
  assert(false)
}

function hasPageExport(pageFile: PageFile): boolean {
  const exportNames = getExportNames(pageFile)
  return exportNames.includes('default') || exportNames.includes('Page')
}
