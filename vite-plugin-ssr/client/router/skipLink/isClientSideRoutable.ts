export { isClientSideRoutable }

import { getPageId } from '../getPageId'
import { analyzePageClientSide, analyzePageClientSideInit } from '../../../shared/getPageFiles/analyzePageClientSide'
import { findPageConfig } from '../../../shared/page-configs/findPageConfig'
import type { PageConfig } from '../../../shared/page-configs/PageConfig'
import { getCodeFilePath, getConfigValue } from '../../../shared/page-configs/utils'
import type { PageFile } from '../../../shared/getPageFiles'

async function isClientSideRoutable(url: string): Promise<boolean> {
  const { pageId, pageFilesAll, pageConfigs } = await getPageId(url)
  if (!pageId) {
    return false
  }
  await analyzePageClientSideInit(pageFilesAll, pageId, { sharedPageFilesAlreadyLoaded: false })
  const pageConfig = findPageConfig(pageConfigs, pageId)
  const { isClientSideRenderable, isClientRouting } = analyze(pageConfig, pageFilesAll, pageId)
  return isClientSideRenderable && isClientRouting
}

function analyze(
  pageConfig: PageConfig | null,
  pageFilesAll: PageFile[],
  pageId: string
): { isClientSideRenderable: boolean; isClientRouting: boolean } {
  if (pageConfig) {
    const isClientRouting = getConfigValue(pageConfig, 'clientRouting', 'boolean') ?? false
    const isClientSideRenderable = !!getCodeFilePath(pageConfig, 'onRenderClient')
    return { isClientSideRenderable, isClientRouting }
  } else {
    // TOOD: globally rename isHtmlOnly to !isClientSideRenderable
    const { isHtmlOnly, isClientRouting } = analyzePageClientSide(pageFilesAll, pageId)
    return { isClientSideRenderable: !isHtmlOnly, isClientRouting }
  }
}
