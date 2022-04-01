export { isClientSideRenderable }

import { getPageId } from '../getPageId'
import { isHtmlOnlyPage } from '../../../shared/pageFilesUtils'

async function isClientSideRenderable(url: string): Promise<boolean> {
  const { pageId, pageFilesAll } = await getPageId(url)
  if (!pageId) {
    return false
  }
  await Promise.all(
    pageFilesAll
      .filter((p) => (p.fileType === '.page' || p.fileType === '.page.client') && p.isRelevant(pageId))
      .map((p) => p.loadExportNames?.()),
  )
  const { isHtmlOnly } = isHtmlOnlyPage(pageId, pageFilesAll, true)
  if (isHtmlOnly) {
    return false
  }
  return true
}
