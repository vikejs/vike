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
  const { isHtmlOnly, isClientRouting } = analyze(pageConfig, pageFilesAll, pageId)
  return !isHtmlOnly && isClientRouting
}

function analyze(
  pageConfig: PageConfig | null,
  pageFilesAll: PageFile[],
  pageId: string
): { isHtmlOnly: boolean; isClientRouting: boolean } {
  if (pageConfig) {
    const isClientRouting = getConfigValue(pageConfig, 'isClientRouting', 'boolean') ?? false
    const clientEntryPageConfig = getCodeFilePath(pageConfig, 'clientEntry')
    const isHtmlOnly = !!clientEntryPageConfig
    return { isHtmlOnly, isClientRouting }
  } else {
    const { isHtmlOnly, isClientRouting } = analyzePageClientSide(pageFilesAll, pageId)
    return { isHtmlOnly, isClientRouting }
  }
}
