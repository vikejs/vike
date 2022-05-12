export { isClientSideRenderable }

import { getPageId } from '../getPageId'
import { analyzePageClientSide } from '../../../shared/getPageFiles/analyzePageClientSide'
import { loadPageExportNames } from '../../../shared/getPageFiles/loadPageExportNames'

async function isClientSideRenderable(url: string): Promise<boolean> {
  const { pageId, pageFilesAll } = await getPageId(url)
  if (!pageId) {
    return false
  }
  await loadPageExportNames(pageFilesAll, pageId, { skipPageSharedFiles: false })
  const { isHtmlOnly, isClientRouting } = analyzePageClientSide(pageFilesAll, pageId)
  return !isHtmlOnly && isClientRouting
}
