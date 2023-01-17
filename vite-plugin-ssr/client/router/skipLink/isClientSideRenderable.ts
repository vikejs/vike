export { isClientSideRenderable }

import { getPageId } from '../getPageId'
import { analyzePageClientSide, analyzePageClientSideInit } from '../../../shared/getPageFiles/analyzePageClientSide'
import { findPageConfig } from '../../../shared/page-configs/findPageConfig'

async function isClientSideRenderable(url: string): Promise<boolean> {
  const { pageId, pageFilesAll, pageConfigs } = await getPageId(url)
  if (!pageId) {
    return false
  }
  await analyzePageClientSideInit(pageFilesAll, pageId, { sharedPageFilesAlreadyLoaded: false })
  const pageConfig = findPageConfig(pageConfigs, pageId)
  const { isHtmlOnly, isClientRouting } = analyzePageClientSide(pageFilesAll, pageConfig, pageId)
  return !isHtmlOnly && isClientRouting
}
