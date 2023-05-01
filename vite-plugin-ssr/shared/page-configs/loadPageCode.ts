export { loadPageCode }

import { assert, assertDefaultExportUnknown, objectAssign } from '../utils'
import type { PageConfig, PageConfigLoaded } from './PageConfig'

async function loadPageCode(pageConfig: PageConfig, isDev: boolean): Promise<PageConfigLoaded> {
  const configValues: Record<string, unknown> = {}

  // In dev, Vite already caches the page's virtual module
  if (!isDev && 'configValues' in pageConfig) {
    return pageConfig as PageConfigLoaded
  }

  const plusValueFiles = await pageConfig.loadPlusValueFiles()
  plusValueFiles.forEach((configValueData) => {
    const { configName, importFile } = configValueData
    let configValue: unknown
    if (configValueData.isPlusFile) {
      const { importFileExports } = configValueData
      if (configName !== 'client') {
        assertDefaultExportUnknown(importFileExports, importFile)
      }
      configValue = importFileExports.default
    } else {
      configValue = configValueData.importValue
    }
    assert(!(configName in configValues))
    configValues[configName] = configValue
  })

  Object.entries(pageConfig.configElements).map(([configName, configElement]) => {
    if (configElement.plusValueFilePath) return
    assert(!(configName in configValues))
    configValues[configName] = configElement.configValue
  })

  objectAssign(pageConfig, { configValues })

  return pageConfig
}
