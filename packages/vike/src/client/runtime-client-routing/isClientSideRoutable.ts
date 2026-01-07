import '../assertEnvClient.js'

export { isClientSideRoutable }

import { analyzePageClientSideInit } from '../../shared-server-client/getPageFiles/analyzePageClientSide.js'
import { findPageConfig } from '../../shared-server-client/page-configs/findPageConfig.js'
import { analyzeClientSide } from '../../shared-server-client/getPageFiles/analyzeClientSide.js'
import type { GlobalContextClientInternal } from './getGlobalContextClientInternal.js'
import type { PageFile } from '../../shared-server-client/getPageFiles.js'

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
