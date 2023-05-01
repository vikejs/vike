export { loadPageCode }

import { assert, assertDefaultExportUnknown, objectAssign } from '../utils'
import type { PlusConfig, PlusConfigLoaded } from './PlusConfig'

async function loadPageCode(plusConfig: PlusConfig, isDev: boolean): Promise<PlusConfigLoaded> {
  const configValues: Record<string, unknown> = {}

  // In dev, Vite already caches the page's virtual module
  if (!isDev && 'configValues' in plusConfig) {
    return plusConfig as PlusConfigLoaded
  }

  const plusValueFiles = await plusConfig.loadPlusValueFiles()
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

  Object.entries(plusConfig.configElements).map(([configName, configElement]) => {
    if (configElement.plusValueFilePath) return
    assert(!(configName in configValues))
    configValues[configName] = configElement.configValue
  })

  objectAssign(plusConfig, { configValues })

  return plusConfig
}
