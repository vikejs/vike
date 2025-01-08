export { isClientSideRoutable }

import { analyzePageClientSideInit } from '../../shared/getPageFiles/analyzePageClientSide.js'
import { findPageConfig } from '../../shared/page-configs/findPageConfig.js'
import { analyzeClientSide } from '../../shared/getPageFiles/analyzeClientSide.js'
import type { PageFile } from '../../shared/getPageFiles.js'
import type { PageConfigRuntime } from '../../shared/page-configs/PageConfig.js'

type PageContextPageFiles = {
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfigRuntime[]
}
// TODO/next-major-release: make it sync
async function isClientSideRoutable(pageId: string, pageContext: PageContextPageFiles): Promise<boolean> {
  await analyzePageClientSideInit(pageContext._pageFilesAll, pageId, {
    sharedPageFilesAlreadyLoaded: false
  })
  const pageConfig = findPageConfig(pageContext._pageConfigs, pageId)
  const { isClientRuntimeLoaded, isClientRouting } = analyzeClientSide(pageConfig, pageContext._pageFilesAll, pageId)
  return isClientRuntimeLoaded && isClientRouting
}
