export { analyzePage }

import type { ClientDependency } from '../../../shared/getPageFiles/analyzePageClientSide/ClientDependency.js'
import { getVikeClientEntry } from '../../../shared/getPageFiles/analyzePageClientSide/determineClientEntry.js'
import type { PageFile } from '../../../shared/getPageFiles/getPageFileObject.js'
import type { PageConfigRuntime } from '../../../types/PageConfig.js'
import { type AnalysisResult, analyzePageClientSide } from '../../../shared/getPageFiles/analyzePageClientSide.js'
import { generateVirtualFileIdEntry } from '../../shared/virtualFiles/parseVirtualFileIdEntry.js'
import { analyzeClientSide } from '../../../shared/getPageFiles/analyzeClientSide.js'
import type { GlobalContextServerInternal } from '../globalContext.js'
import { getConfigValueRuntime } from '../../../shared/page-configs/getConfigValueRuntime.js'

async function analyzePage(
  pageFilesAll: PageFile[],
  pageConfig: null | PageConfigRuntime,
  pageId: string,
  globalContext: GlobalContextServerInternal,
): Promise<AnalysisResult> {
  if (pageConfig) {
    const { isClientRuntimeLoaded, isClientRouting } = analyzeClientSide(pageConfig, pageFilesAll, pageId)
    const clientEntries: string[] = []
    const clientFilePath = getConfigValueRuntime(pageConfig, 'client', 'string')?.value ?? null
    if (clientFilePath) clientEntries.push(clientFilePath)
    if (isClientRuntimeLoaded) clientEntries.push(getVikeClientEntry(isClientRouting))
    const clientDependencies: ClientDependency[] = []
    clientDependencies.push({
      id: generateVirtualFileIdEntry('page', { pageId: pageConfig.pageId, isForClientSide: true }),
      onlyAssets: isClientRuntimeLoaded ? false : true,
      eagerlyImported: false,
    })
    // In production we inject the import of the server virtual module with ?extractAssets inside the client virtual module
    if (!globalContext._isProduction) {
      clientDependencies.push({
        id: generateVirtualFileIdEntry('page', { pageId: pageConfig.pageId, isForClientSide: false }),
        onlyAssets: true,
        eagerlyImported: false,
      })
    }
    /* Remove?
    Object.values(pageConfig.configElements).forEach((configElement) => {
      if (configElement.importPath) {
        const { env } = configElement
        assert(env)
        const onlyAssets = env === { server: true }
        const eagerlyImported = env === { server: true, client: 'if-client-routing', eager: true }
        if (onlyAssets || eagerlyImported) {
          clientDependencies.push({
            id: configElement.importPath,
            onlyAssets,
            eagerlyImported
          })
        }
      }
    })
    */
    clientEntries.forEach((clientEntry) => {
      clientDependencies.push({
        id: clientEntry,
        onlyAssets: false,
        eagerlyImported: false,
      })
    })
    return {
      isHtmlOnly: !isClientRuntimeLoaded,
      isClientRouting,
      clientEntries,
      clientDependencies,
      // pageFilesClientSide and pageFilesServerSide are only used for debugging
      pageFilesClientSide: [],
      pageFilesServerSide: [],
    }
  } else {
    return analyzePageClientSide(pageFilesAll, pageId)
  }
}
