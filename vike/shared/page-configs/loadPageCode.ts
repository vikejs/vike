export { loadPageCode }
export { processConfigValuesImported }

import { assert, assertUsage, objectAssign } from '../utils.js'
import { assertExportsOfValueFile } from './assertExports.js'
import type { ConfigValueImported, PageConfig, PageConfigLoaded } from './PageConfig.js'
import pc from '@brillout/picocolors'

// TODO: rename loadPageCode() -> loadConfigValues()
async function loadPageCode(pageConfig: PageConfig, isDev: boolean): Promise<PageConfigLoaded> {
  if (
    pageConfig.isLoaded &&
    // We don't need to cache in dev, since Vite already caches the virtual module
    !isDev
  ) {
    return pageConfig as PageConfigLoaded
  }
  const configValuesImported = await pageConfig.loadConfigValuesAll()
  processConfigValuesImported(configValuesImported, pageConfig)
  objectAssign(pageConfig, { isLoaded: true as const })
  return pageConfig
}

function processConfigValuesImported(configValuesImported: ConfigValueImported[], pageConfig: PageConfig) {
  // TODO: remove?
  // pageConfig.configValuesOld = pageConfig.configValuesOld.filter((val) => !val.definedByCodeFile)

  const addConfigValue = (configName: string, value: unknown, filePath: string, exportName: string) => {
    /* TODO
    assert(!isAlreadyDefined(val.configName), val.configName) // Conflicts are resolved upstream
    */
    pageConfig.configValues[configName] = {
      value,
      definedAtInfo: {
        filePath,
        fileExportPath: [exportName]
      }
      /* TODO: remove?
      definedByCodeFile: true
      */
    }
    assertIsNotNull(value, configName, filePath)
  }

  configValuesImported.forEach((configValueLoaded) => {
    if (configValueLoaded.isValueFile) {
      const { importFileExports, importFilePath, configName } = configValueLoaded
      if (configName !== 'client') {
        assertExportsOfValueFile(importFileExports, importFilePath, configName)
      }
      Object.entries(importFileExports).forEach(([exportName, exportValue]) => {
        const isSideExport = exportName !== 'default' // .md files may have "side-exports" such as `export { frontmatter }`
        const configName = isSideExport ? exportName : configValueLoaded.configName
        if (isSideExport && configName in pageConfig.configValues) {
          // We can't avoid side-export conflicts upstream. (Because we cannot know about side-exports upstream at build-time.)
          // Side-exports have the lowest priority.
          return
        }
        addConfigValue(configName, exportValue, importFilePath, exportName)
      })
    } else {
      const { configName, importFilePath, importFileExportValue, exportName } = configValueLoaded
      addConfigValue(configName, importFileExportValue, importFilePath, exportName)
    }
  })
}

function assertIsNotNull(configValue: unknown, configName: string, importFilePath: string) {
  assert(!importFilePath.includes('+config.'))
  assertUsage(
    configValue !== null,
    `Set ${pc.cyan(configName)} to ${pc.cyan('null')} in a +config.h.js file instead of ${importFilePath}`
  )
}
