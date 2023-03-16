export { analyzePage }

import type { ClientDependency } from '../../../shared/getPageFiles/analyzePageClientSide/ClientDependency'
import { getVPSClientEntry } from '../../../shared/getPageFiles/analyzePageClientSide/determineClientEntry'
import type { PageFile } from '../../../shared/getPageFiles/getPageFileObject'
import type { PageConfig } from '../../../shared/page-configs/PageConfig'
import { getCodeFilePath } from '../../../shared/page-configs/utils'
import { type AnalysisResult, analyzePageClientSide } from '../../../shared/getPageFiles/analyzePageClientSide'
import { getVirtualFileIdImportPageCode } from '../../shared/virtual-files/virtualFileImportPageCode'
import { analyzeClientSide } from '../../../shared/getPageFiles/analyzeClientSide'
import { getGlobalContext } from '../globalContext'

function analyzePage(pageFilesAll: PageFile[], pageConfig: null | PageConfig, pageId: string): AnalysisResult {
  if (pageConfig) {
    const { isClientSideRenderable, isClientRouting } = analyzeClientSide(pageConfig, pageFilesAll, pageId)
    const clientEntryPageConfig = getCodeFilePath(pageConfig, 'clientEntry')
    const clientEntry = !isClientSideRenderable ? clientEntryPageConfig : getVPSClientEntry(isClientRouting)
    const clientDependencies: ClientDependency[] = []
    clientDependencies.push({
      id: getVirtualFileIdImportPageCode(pageConfig.pageId2, true),
      onlyAssets: false,
      eagerlyImported: false
    })
    // In production we inject the import of the server virtual module with ?extractAssets inside the client virtual module
    if (!getGlobalContext().isProduction) {
      clientDependencies.push({
        id: getVirtualFileIdImportPageCode(pageConfig.pageId2, false),
        onlyAssets: true,
        eagerlyImported: false
      })
    }
    //*/
    /* TODO: remove?
    Object.values(pageConfig.configSources).forEach((configSource) => {
      if (configSource.codeFilePath) {
        const { c_env } = configSource
        assert(c_env)
        const onlyAssets = c_env === 'server-only'
        const eagerlyImported = c_env === 'c_routing'
        if (onlyAssets || eagerlyImported) {
          clientDependencies.push({
            id: configSource.codeFilePath,
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
