export { isClientSideRoutable }

import { analyzePageClientSideInit } from '../../shared/getPageFiles/analyzePageClientSide.js'
import { findPageConfig } from '../../shared/page-configs/findPageConfig.js'
import { analyzeClientSide } from '../../shared/getPageFiles/analyzeClientSide.js'
import type { PageFile } from '../../shared/getPageFiles.js'
import type { PageConfigRuntime } from '../../shared/page-configs/PageConfig.js'

async function isClientSideRoutable(pageContext: {
  _pageId: string | null
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfigRuntime[]
}): Promise<boolean> {
  if (!pageContext._pageId) {
    return false
  }
  await analyzePageClientSideInit(pageContext._pageFilesAll, pageContext._pageId, {
    sharedPageFilesAlreadyLoaded: false
  })
  const pageConfig = findPageConfig(pageContext._pageConfigs, pageContext._pageId)
  const { isClientSideRenderable, isClientRouting } = analyzeClientSide(
    pageConfig,
    pageContext._pageFilesAll,
    pageContext._pageId
  )
  return isClientSideRenderable && isClientRouting
}
