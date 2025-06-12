export { analyzeClientSide }

import { getConfigValueRuntime } from '../page-configs/getConfigValueRuntime.js'
import type { PageConfigRuntime } from '../../types/PageConfig.js'
import type { PageFile } from './getPageFileObject.js'
import { analyzePageClientSide } from './analyzePageClientSide.js'

function analyzeClientSide(
  pageConfig: PageConfigRuntime | null,
  pageFilesAll: PageFile[],
  pageId: string,
): { isClientRuntimeLoaded: boolean; isClientRouting: boolean } {
  // V1 design
  if (pageConfig) {
    const isClientRouting = getConfigValueRuntime(pageConfig, 'clientRouting', 'boolean')?.value ?? false
    const isClientRuntimeLoaded = getConfigValueRuntime(pageConfig, 'isClientRuntimeLoaded', 'boolean')?.value ?? false
    return { isClientRuntimeLoaded, isClientRouting }
  } else {
    // TODO/v1-release: remove
    // V0.4 design
    const { isHtmlOnly, isClientRouting } = analyzePageClientSide(pageFilesAll, pageId)
    return { isClientRuntimeLoaded: !isHtmlOnly, isClientRouting }
  }
}
