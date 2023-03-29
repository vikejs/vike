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
  if (pageConfig) {
    const isClientRouting = getConfigValue(pageConfig, 'clientRouting', 'boolean') ?? false
    const onRenderClientExists: boolean = !!getCodeFilePath(pageConfig, 'onRenderClient')
    const PageExists: boolean =
      !!getCodeFilePath(pageConfig, 'Page') && pageConfig.configSources.Page!.configEnv !== 'server-only'
    const isClientSideRenderable = onRenderClientExists && PageExists
    return { isClientSideRenderable, isClientRouting }
  } else {
    // TOOD: globally rename isHtmlOnly to !isClientSideRenderable
    const { isHtmlOnly, isClientRouting } = analyzePageClientSide(pageFilesAll, pageId)
    return { isClientSideRenderable: !isHtmlOnly, isClientRouting }
  }
}
