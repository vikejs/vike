export { isClientSideRoutable }

import { analyzePageClientSideInit } from '../../shared/getPageFiles/analyzePageClientSide'
import { findPageConfig } from '../../shared/page-configs/findPageConfig'
import { analyzeClientSide } from '../../shared/getPageFiles/analyzeClientSide'
import type { PageFile } from '../../shared/getPageFiles'
import type { PageConfigRuntime } from '../../shared/page-configs/PageConfig'

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
