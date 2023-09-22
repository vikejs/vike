export { isClientSideRoutable }

import { getPageId } from '../getPageId.js'
import { analyzePageClientSideInit } from '../../../shared/getPageFiles/analyzePageClientSide.js'
import { findPageConfig } from '../../../shared/page-configs/findPageConfig.js'
import { analyzeClientSide } from '../../../shared/getPageFiles/analyzeClientSide.js'

async function isClientSideRoutable(url: string): Promise<boolean> {
  const { pageId, pageFilesAll, pageConfigs } = await getPageId(url)
  if (!pageId) {
    return false
  }
  await analyzePageClientSideInit(pageFilesAll, pageId, { sharedPageFilesAlreadyLoaded: false })
  const pageConfig = findPageConfig(pageConfigs, pageId)
  const { isClientSideRenderable, isClientRouting } = analyzeClientSide(pageConfig, pageFilesAll, pageId)
  return isClientSideRenderable && isClientRouting
}
