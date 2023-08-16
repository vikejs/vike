export { analyzePage }

import type { ClientDependency } from '../../../shared/getPageFiles/analyzePageClientSide/ClientDependency.js'
import { getVPSClientEntry } from '../../../shared/getPageFiles/analyzePageClientSide/determineClientEntry.js'
import type { PageFile } from '../../../shared/getPageFiles/getPageFileObject.js'
import type { PageConfig } from '../../../shared/page-configs/PageConfig.js'
import { getCodeFilePath } from '../../../shared/page-configs/utils.js'
import { type AnalysisResult, analyzePageClientSide } from '../../../shared/getPageFiles/analyzePageClientSide.js'
import { getVirtualFileIdImportPageCode } from '../../shared/virtual-files/virtualFileImportPageCode.js'
import { analyzeClientSide } from '../../../shared/getPageFiles/analyzeClientSide.js'
import { getGlobalContext } from '../globalContext.js'

function analyzePage(pageFilesAll: PageFile[], pageConfig: null | PageConfig, pageId: string): AnalysisResult {
  if (pageConfig) {
    const { isClientSideRenderable, isClientRouting } = analyzeClientSide(pageConfig, pageFilesAll, pageId)
    const clientFilePath = getCodeFilePath(pageConfig, 'client')
    const clientEntry = !isClientSideRenderable ? clientFilePath : getVPSClientEntry(isClientRouting)
    const clientDependencies: ClientDependency[] = []
    clientDependencies.push({
      id: getVirtualFileIdImportPageCode(pageConfig.pageId, true),
      onlyAssets: false,
      eagerlyImported: false
    })
    // In production we inject the import of the server virtual module with ?extractAssets inside the client virtual module
    if (!getGlobalContext().isProduction) {
      clientDependencies.push({
        id: getVirtualFileIdImportPageCode(pageConfig.pageId, false),
        onlyAssets: true,
        eagerlyImported: false
      })
    }
    /* Remove?
    Object.values(pageConfig.configElements).forEach((configElement) => {
      if (configElement.codeFilePath) {
        const { env } = configElement
        assert(env)
        const onlyAssets = env === 'server-only'
        const eagerlyImported = env === '_routing-eager'
        if (onlyAssets || eagerlyImported) {
          clientDependencies.push({
            id: configElement.codeFilePath,
            onlyAssets,
            eagerlyImported
          })
        }
      }
    })
    */
    const clientEntries: string[] = []
    if (clientEntry) {
      clientDependencies.push({
        id: clientEntry,
        onlyAssets: false,
        eagerlyImported: false
      })
      clientEntries.push(clientEntry)
    }
    return {
      isHtmlOnly: !isClientSideRenderable,
      isClientRouting,
      clientEntries,
      clientDependencies,
      // pageFilesClientSide and pageFilesServerSide are only used for debugging
      pageFilesClientSide: [],
      pageFilesServerSide: []
    }
  } else {
    return analyzePageClientSide(pageFilesAll, pageId)
  }
}
