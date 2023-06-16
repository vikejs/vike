export { analyzeClientSide }

import { getCodeFilePath, getConfigValue } from '../page-configs/utils'
import type { PageConfig } from '../page-configs/PageConfig'
import type { PageFile } from './getPageFileObject'
import { analyzePageClientSide } from './analyzePageClientSide'

function analyzeClientSide(
  pageConfig: PageConfig | null,
  pageFilesAll: PageFile[],
  pageId: string
): { isClientSideRenderable: boolean; isClientRouting: boolean } {
  // V1 design
  if (pageConfig) {
    const isClientRouting = getConfigValue(pageConfig, 'clientRouting', 'boolean') ?? false
    const onRenderClientExists: boolean = !!getCodeFilePath(pageConfig, 'onRenderClient')
    const PageExists: boolean =
      !!getCodeFilePath(pageConfig, 'Page') && pageConfig.configElements.Page!.configEnv !== 'server-only'
    const isClientSideRenderable = onRenderClientExists && PageExists
    return { isClientSideRenderable, isClientRouting }
  } else {
    // TODO/v1-release:
    //  - remove V0.4 implementation
    //  - globally rename isHtmlOnly to !isClientSideRenderable
    // V0.4 design
    const { isHtmlOnly, isClientRouting } = analyzePageClientSide(pageFilesAll, pageId)
    return { isClientSideRenderable: !isHtmlOnly, isClientRouting }
  }
}
