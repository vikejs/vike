export { loadPageCode }

import { assert, assertDefaultExport, objectAssign } from '../utils'
import type { PageConfig, PageConfigLoaded } from './PageConfig'

async function loadPageCode(pageConfig: PageConfig, isDev: boolean): Promise<PageConfigLoaded> {
  const configValues: Record<string, unknown> = {}

  // In dev, Vite already caches the page's virtual module
  if (!isDev && 'configValues' in pageConfig) {
    return pageConfig as PageConfigLoaded
  }

  const codeFiles = await pageConfig.loadCodeFiles()
  codeFiles.forEach(({ configName, codeFilePath3, codeFileExports }) => {
    assertDefaultExport(codeFileExports, codeFilePath3)
    assert(!(configName in configValues))
    configValues[configName] = codeFileExports.default
  })

  Object.entries(pageConfig.configSources).map(([configName, configSource]) => {
    if (configSource.codeFilePath2) return
    assert(!(configName in configValues))
    configValues[configName] = configSource.configValue
  })

  objectAssign(pageConfig, { configValues })

  return pageConfig
}
