export { isClientSideRoutable }

import { getPageId } from '../getPageId'
import { analyzePageClientSideInit } from '../../../shared/getPageFiles/analyzePageClientSide'
import { findPlusConfig } from '../../../shared/page-configs/findPlusConfig'
import { analyzeClientSide } from '../../../shared/getPageFiles/analyzeClientSide'

async function isClientSideRoutable(url: string): Promise<boolean> {
  const { pageId, pageFilesAll, plusConfigs } = await getPageId(url)
  if (!pageId) {
    return false
  }
  await analyzePageClientSideInit(pageFilesAll, pageId, { sharedPageFilesAlreadyLoaded: false })
  const plusConfig = findPlusConfig(plusConfigs, pageId)
  const { isClientSideRenderable, isClientRouting } = analyzeClientSide(plusConfig, pageFilesAll, pageId)
  return isClientSideRenderable && isClientRouting
}
