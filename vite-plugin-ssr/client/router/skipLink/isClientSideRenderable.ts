export { isClientSideRenderable }

import { getPageId } from '../getPageId'
import { analyzePageClientSide, analyzePageClientSideInit } from '../../../shared/getPageFiles/analyzePageClientSide'

async function isClientSideRenderable(url: string): Promise<boolean> {
  const { pageId, pageFilesAll } = await getPageId(url)
  if (!pageId) {
    return false
  }
  await analyzePageClientSideInit(pageFilesAll, pageId, { sharedPageFilesAlreadyLoaded: false })
  const { isHtmlOnly, isClientRouting } = analyzePageClientSide(pageFilesAll, pageId)
  return !isHtmlOnly && isClientRouting
}
