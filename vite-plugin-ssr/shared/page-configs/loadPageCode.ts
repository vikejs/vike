export { loadPageCode }

import { assert, assertDefaultExportUnknown, assertUsage, objectAssign } from '../utils.js'
import type { ConfigValues, PageConfig, PageConfigLoaded } from './PageConfig.js'
import pc from '@brillout/picocolors'

async function loadPageCode(pageConfig: PageConfig, isDev: boolean): Promise<PageConfigLoaded> {
  const configValues: ConfigValues = {}

  if (
    pageConfig.isLoaded &&
    // We don't need to cache in dev, since Vite already caches the virtual module
    !isDev
  ) {
    return pageConfig as PageConfigLoaded
  }

  const codeFiles = await pageConfig.loadCodeFiles()
  codeFiles.forEach((codeFile) => {
    if (codeFile.isPlusFile) {
      const { codeFileExports, codeFilePath } = codeFile
      if (codeFile.configName !== 'client') {
        assertDefaultExportUnknown(codeFileExports, codeFilePath)
      }
      Object.entries(codeFileExports).forEach(([exportName, exportValue]) => {
        const isSideExport = exportName !== 'default' // .md files may have "side-exports" such as `export { frontmatter }`
        const configName = isSideExport ? exportName : codeFile.configName
        const configValue = exportValue
        configValues[configName] = {
          configSourceFile: codeFilePath,
          configSourceFileExportName: exportName,
          configValue
        }
        assertIsNotNull(configValue, configName, codeFilePath)
      })
    } else {
      const { configName, codeFilePath } = codeFile
      const configValue = codeFile.codeFileExportValue
      configValues[configName] = {
        configSourceFile: codeFilePath,
        configSourceFileExportName: 'default',
        configValue
      }
      assertIsNotNull(configValue, configName, codeFilePath)
    }
  })

  objectAssign(pageConfig, { isLoaded: true as const })

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
