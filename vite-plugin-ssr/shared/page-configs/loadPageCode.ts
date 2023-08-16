export { loadPageCode }

import { assert, assertDefaultExportUnknown, objectAssign } from '../utils.js'
import type { PageConfig, PageConfigLoaded } from './PageConfig.js'

async function loadPageCode(pageConfig: PageConfig, isDev: boolean): Promise<PageConfigLoaded> {
  const configValues: Record<string, unknown> = {}

  // In dev, Vite already caches the page's virtual module
  if (!isDev && 'configValues' in pageConfig) {
    return pageConfig as PageConfigLoaded
  }

  const codeFiles = await pageConfig.loadCodeFiles()
  codeFiles.forEach((codeFile) => {
    const { configName, codeFilePath } = codeFile
    let configValue: unknown
    if (codeFile.isPlusFile) {
      const { codeFileExports } = codeFile
      if (configName !== 'client') {
        assertDefaultExportUnknown(codeFileExports, codeFilePath)
      }
      Object.entries(codeFileExports).forEach(([exportName, exportValue]) => {
        const isSideExport = exportName !== 'default'
        const configName = isSideExport ? exportName : codeFile.configName
        const configValue = exportValue
        configValues[configName] = configValue
        if (isSideExport) {
          const configElementOfMainExport = pageConfig.configElements[codeFile.configName]
          assert(configElementOfMainExport)
          pageConfig.configElements[configName] = {
            configValue,
            codeFileExport: exportName,
            codeFilePath,
            configDefinedByFile: codeFilePath,
            configDefinedAt: `${codeFilePath} > export { ${exportName} }`,
            configEnv: configElementOfMainExport.configEnv,
            plusConfigFilePath: null
          }
        }
      })
    } else {
      configValue = codeFile.codeFileExportValue
      configValues[configName] = configValue
    }
  })

  Object.entries(pageConfig.configElements).map(([configName, configElement]) => {
    if (configElement.codeFilePath) return
    configValues[configName] = configElement.configValue
  })

  objectAssign(pageConfig, { configValues })

  return pageConfig
}
