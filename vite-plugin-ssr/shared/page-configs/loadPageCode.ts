export { loadPageCode }

import { assert, assertDefaultExportUnknown, assertUsage, objectAssign } from '../utils.js'
import type { PageConfig, PageConfigLoaded } from './PageConfig.js'
import pc from '@brillout/picocolors'

async function loadPageCode(pageConfig: PageConfig, isDev: boolean): Promise<PageConfigLoaded> {
  const configValues: Record<string, unknown> = {}

  // In dev, Vite already caches the page's virtual module
  if (!isDev && 'configValues' in pageConfig) {
    return pageConfig as PageConfigLoaded
  }

  const codeFiles = await pageConfig.loadCodeFiles()
  codeFiles.forEach((codeFile) => {
    const { configName, codeFilePath } = codeFile
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
        assertIsNotNull(configValue, configName, codeFilePath)
        if (isSideExport) {
          const configElementOfMainExport = pageConfig.configElements[codeFile.configName]
          assert(configElementOfMainExport)
          pageConfig.configElements[configName] = {
            configValue,
            codeFileExport: exportName,
            codeFilePath,
            configDefinedByFile: codeFilePath,
            configDefinedAt: `${pc.bold(codeFilePath)} > ${pc.cyan(`export { ${exportName} }`)}`,
            configEnv: configElementOfMainExport.configEnv,
            plusConfigFilePath: null
          }
        }
      })
    } else {
      const configValue = codeFile.codeFileExportValue
      configValues[configName] = configValue
      assertIsNotNull(configValue, configName, codeFilePath)
    }
  })

  Object.entries(pageConfig.configElements).map(([configName, configElement]) => {
    if (configElement.codeFilePath) return
    configValues[configName] = configElement.configValue
  })

  objectAssign(pageConfig, { configValues })

  return pageConfig
}

function assertIsNotNull(configValue: unknown, configName: string, codeFilePath: string) {
  assert(!codeFilePath.includes('+config.'))
  assertUsage(
    configValue !== null,
    `Set ${pc.cyan(configName)} to ${pc.cyan('null')} in a ${pc.bold('+config.js')} file instead of ${pc.bold(
      codeFilePath
    )}`
  )
}
