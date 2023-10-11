export { loadPageCode }

import { assert, assertUsage, objectAssign } from '../utils.js'
import { assertDefaultExportUnknown } from './assertExports.js'
import type { PageConfig, PageConfigLoaded } from './PageConfig.js'
import pc from '@brillout/picocolors'

async function loadPageCode(pageConfig: PageConfig, isDev: boolean): Promise<PageConfigLoaded> {
  if (
    pageConfig.isLoaded &&
    // We don't need to cache in dev, since Vite already caches the virtual module
    !isDev
  ) {
    return pageConfig as PageConfigLoaded
  }

  const configValuesAll = await pageConfig.loadConfigValuesAll()

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

  configValuesAll.forEach((configValueLoaded) => {
    if (configValueLoaded.isPlusFile) {
      const { importFileExports, importFilePath } = configValueLoaded
      if (configValueLoaded.configName !== 'client') {
        assertDefaultExportUnknown(importFileExports, importFilePath)
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
      const { configName, importFilePath, importFileExportValue, importFileExportName } = configValueLoaded
      addConfigValue(configName, importFileExportValue, importFilePath, importFileExportName)
    }
  })

  objectAssign(pageConfig, { isLoaded: true as const })

  return pageConfig
}

function assertIsNotNull(configValue: unknown, configName: string, importFilePath: string) {
  assert(!importFilePath.includes('+config.'))
  assertUsage(
    configValue !== null,
    `Set ${pc.cyan(configName)} to ${pc.cyan('null')} in a +config.h.js file instead of ${importFilePath}`
  )
}
