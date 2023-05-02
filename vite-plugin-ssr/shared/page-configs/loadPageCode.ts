export { loadPageCode }

import { assert, assertDefaultExportUnknown, objectAssign } from '../utils'
import type { PageConfig, PageConfigLoaded } from './PageConfig'

async function loadPageCode(pageConfig: PageConfig, isDev: boolean): Promise<PageConfigLoaded> {
  const configValues: Record<string, unknown> = {}

  // In dev, Vite already caches the page's virtual module
  if (!isDev && 'configValues' in pageConfig) {
    return pageConfig as PageConfigLoaded
  }

  const codeFiles = await pageConfig.loadCodeFiles()
  codeFiles.forEach((codeFile) => {
    const { configName, importFile } = codeFile
    let configValue: unknown
    if (codeFile.isPlusFile) {
      const { importFileExports } = codeFile
      if (configName !== 'client') {
        assertDefaultExportUnknown(importFileExports, importFile)
      }
      configValue = importFileExports.default
    } else {
      configValue = codeFile.importValue
    }
    assert(!(configName in configValues))
    configValues[configName] = configValue
  })

  Object.entries(pageConfig.configElements).map(([configName, configElement]) => {
    if (configElement.codeFilePath) return
    assert(!(configName in configValues))
    configValues[configName] = configElement.configValue
  })

  objectAssign(pageConfig, { configValues })

  return pageConfig
}
