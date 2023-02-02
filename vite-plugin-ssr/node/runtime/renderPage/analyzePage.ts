export { analyzePage }

import type { ClientDependency } from '../../../shared/getPageFiles/analyzePageClientSide/ClientDependency'
import { getVPSClientEntry } from '../../../shared/getPageFiles/analyzePageClientSide/determineClientEntry'
import type { PageFile } from '../../../shared/getPageFiles/getPageFileObject'
import type { PageConfig } from '../../../shared/page-configs/PageConfig'
import { getCodeFilePath, getConfigValue } from '../../../shared/page-configs/utils'
import { assert } from '../../utils'
import { type AnalysisResult, analyzePageClientSide } from '../../../shared/getPageFiles/analyzePageClientSide'
import { getVirutalModuleIdPageCodeFilesImporter } from '../../commons/virtualIdPageCodeFilesImporter'

function analyzePage(pageFilesAll: PageFile[], pageConfig: null | PageConfig, pageId: string): AnalysisResult {
  if (pageConfig) {
    const isClientRouting = getConfigValue(pageConfig, 'isClientRouting', 'boolean') ?? false
    const clientEntryPageConfig = getCodeFilePath(pageConfig, 'clientEntry')
    const isHtmlOnly = !!clientEntryPageConfig
    const clientEntry = isHtmlOnly ? clientEntryPageConfig : getVPSClientEntry(isClientRouting)
    const clientDependencies: ClientDependency[] = []
    assert(pageConfig.configSources.onRenderHtml)
    assert(pageConfig.configSources.onRenderClient)
    clientDependencies.push({
      id: getVirutalModuleIdPageCodeFilesImporter(pageConfig.pageId2, true),
      onlyAssets: false,
      eagerlyImported: false
    })
    clientDependencies.push({
      id: getVirutalModuleIdPageCodeFilesImporter(pageConfig.pageId2, false),
      onlyAssets: true,
      eagerlyImported: false
    })
    /* TODO: remove?
    Object.values(pageConfig.configSources).forEach((configSource) => {
      if (configSource.codeFilePath) {
        const { c_env } = configSource
        assert(c_env)
        const onlyAssets = c_env === 'server-only'
        const eagerlyImported = c_env === 'routing'
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
    clientDependencies.push({
      id: clientEntry,
      onlyAssets: false,
      eagerlyImported: false
    })
    const clientEntries: string[] = [clientEntry]
    return {
      isHtmlOnly,
      isClientRouting,
      clientEntries,
      clientDependencies,
      // pageFilesClientSide and pageFilesServerSide are only used for debugging
      pageFilesClientSide: [],
      pageFilesServerSide: []
    }
  }

  return analyzePageClientSide(pageFilesAll, pageId)
}
