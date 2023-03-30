export { loadPageCode }

import { assert, assertDefaultExportUnknown, objectAssign } from '../utils'
import type { PageConfig, PageConfigLoaded } from './PageConfig'

async function loadPageCode(pageConfig: PageConfig, isDev: boolean): Promise<PageConfigLoaded> {
  const configValues: Record<string, unknown> = {}

  // In dev, Vite already caches the page's virtual module
  if (!isDev && 'configValues' in pageConfig) {
    return pageConfig as PageConfigLoaded
  }

  const configValueFiles = await pageConfig.loadConfigValueFiles()
  configValueFiles.forEach(({ configName, codeFilePath3, codeFileExports }) => {
    if (configName !== 'clientEntry') {
      assertDefaultExportUnknown(codeFileExports, codeFilePath3)
    }
    assert(!(configName in configValues))
    configValues[configName] = codeFileExports.default
  })

  Object.entries(pageConfig.configElements).map(([configName, configElement]) => {
    if (configElement.configValueFilePath) return
    assert(!(configName in configValues))
    configValues[configName] = configElement.configValue
  })

  objectAssign(pageConfig, { configValues })

  return pageConfig
}
