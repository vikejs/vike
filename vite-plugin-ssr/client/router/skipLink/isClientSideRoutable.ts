export { isClientSideRoutable }

import { getPageId } from '../getPageId'
import { analyzePageClientSideInit } from '../../../shared/getPageFiles/analyzePageClientSide'
import { findPageConfig } from '../../../shared/page-configs/findPageConfig'
import { analyzeClientSide } from '../../../shared/getPageFiles/analyzeClientSide'

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
