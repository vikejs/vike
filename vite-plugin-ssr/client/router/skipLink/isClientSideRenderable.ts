export { isClientSideRenderable }

import { getPageId } from '../getPageId'
import { loadPageFilesClientExportNames } from '../../../shared/getPageFiles/loadPageFilesClientExportNames'

async function isClientSideRenderable(url: string): Promise<boolean> {
  const { pageId, pageFilesAll } = await getPageId(url)
  if (!pageId) {
    return false
  }
  const pageContextAddendum = await loadPageFilesClientExportNames(pageFilesAll, pageId, true)
  return !pageContextAddendum._isHtmlOnly
}
