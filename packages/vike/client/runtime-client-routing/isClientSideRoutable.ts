export { isClientSideRoutable }

import { analyzePageClientSideInit } from '../../shared/getPageFiles/analyzePageClientSide.js'
import { findPageConfig } from '../../shared/page-configs/findPageConfig.js'
import { analyzeClientSide } from '../../shared/getPageFiles/analyzeClientSide.js'
import type { GlobalContextClientInternal } from './createGlobalContextClient.js'
import type { PageFile } from '../../shared/getPageFiles.js'

// TO-DO/next-major-release: make it sync
async function isClientSideRoutable(
  pageId: string,
  pageContext: {
    _globalContext: GlobalContextClientInternal
    _pageFilesAll: PageFile[]
  },
): Promise<boolean> {
  await analyzePageClientSideInit(pageContext._pageFilesAll, pageId, {
    sharedPageFilesAlreadyLoaded: false,
  })
  const pageConfig = findPageConfig(pageContext._globalContext._pageConfigs, pageId)
  const { isClientRuntimeLoaded, isClientRouting } = analyzeClientSide(pageConfig, pageContext._pageFilesAll, pageId)
  return isClientRuntimeLoaded && isClientRouting
}
