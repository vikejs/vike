export { analyzeClientSide }

import { getCodeFilePath, getConfigValue } from '../page-configs/utils'
import type { PlusConfig } from '../page-configs/PlusConfig'
import type { PageFile } from './getPageFileObject'
import { analyzePageClientSide } from './analyzePageClientSide'

function analyzeClientSide(
  plusConfig: PlusConfig | null,
  pageFilesAll: PageFile[],
  pageId: string
): { isClientSideRenderable: boolean; isClientRouting: boolean } {
  if (plusConfig) {
    const isClientRouting = getConfigValue(plusConfig, 'clientRouting', 'boolean') ?? false
    const onRenderClientExists: boolean = !!getCodeFilePath(plusConfig, 'onRenderClient')
    const PageExists: boolean =
      !!getCodeFilePath(plusConfig, 'Page') && plusConfig.configElements.Page!.configEnv !== 'server-only'
    const isClientSideRenderable = onRenderClientExists && PageExists
    return { isClientSideRenderable, isClientRouting }
  } else {
    // TOOD: globally rename isHtmlOnly to !isClientSideRenderable
    const { isHtmlOnly, isClientRouting } = analyzePageClientSide(pageFilesAll, pageId)
    return { isClientSideRenderable: !isHtmlOnly, isClientRouting }
  }
}
