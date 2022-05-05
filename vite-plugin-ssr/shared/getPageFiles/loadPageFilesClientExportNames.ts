export { loadPageFilesClientExportNames }
export { getExportNames_serverSide }

import type { PageFile } from './types'
import { assert } from '../utils'

async function loadPageFilesClientExportNames(
  pageFilesAll: PageFile[],
  pageId: string,
  loadIsomorphicPageFiles: boolean,
) {
  await Promise.all(
    pageFilesAll
      .filter(
        (p) =>
          (p.fileType === '.page.client' || (loadIsomorphicPageFiles && p.fileType === '.page')) &&
          p.isRelevant(pageId),
      )
      .map((p) => p.loadExportNames?.()),
  )

  const { isHtmlOnly, pageFilesClientCandidates } = isHtmlOnlyPage(pageId, pageFilesAll, false)

  const pageContextAddendum = {
    _isHtmlOnly: isHtmlOnly,
    _pageFilesClientSide: pageFilesClientCandidates,
  }

  return pageContextAddendum
}

// Returns true for pages that don't have a `render()` hook, or don't have a `Page` export
function isHtmlOnlyPage(pageId: string, pageFilesAll: PageFile[], isClientSide: boolean) {
  // All `.page.client.js` and .page.js` files relevant to `pageId`
  const pageFilesClientCandidates = pageFilesAll.filter(
    (p) => (p.fileType === '.page.client' || p.fileType === '.page') && p.isRelevant(pageId),
  )
  const hasPage = pageFilesClientCandidates.some((p) => _getExportNames(p, isClientSide).includes('Page'))
  const hasRender = pageFilesClientCandidates.some((p) => _getExportNames(p, isClientSide).includes('render'))
  const isHtmlOnly = !hasPage || !hasRender
  return { isHtmlOnly, pageFilesClientCandidates }
}

function getExportNames_serverSide(pageFile: PageFile) {
  return _getExportNames(pageFile, false)
}

function _getExportNames(pageFile: PageFile, isClientSide: boolean): string[] {
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
