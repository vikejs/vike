export { parseConfigValuesImported }

import { assert, assertUsage } from '../utils.js'
import { assertExportsOfValueFile } from './assertExports.js'
import type { ConfigValueImported, ConfigValues } from './PageConfig.js'
import pc from '@brillout/picocolors'

function parseConfigValuesImported(configValuesImported: ConfigValueImported[]): ConfigValues {
  // TODO: remove?
  // pageConfig.configValuesOld = pageConfig.configValuesOld.filter((val) => !val.definedByCodeFile)

  const configValues: ConfigValues = {}

  const addConfigValue = (configName: string, value: unknown, filePath: string, exportName: string) => {
    /* TODO
    assert(!isAlreadyDefined(val.configName), val.configName) // Conflicts are resolved upstream
    */
    configValues[configName] = {
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
      const { importFileExports, importPath, configName } = configValueLoaded
      if (configName !== 'client') {
        assertExportsOfValueFile(importFileExports, importPath, configName)
      }
      Object.entries(importFileExports).forEach(([exportName, exportValue]) => {
        const isSideExport = exportName !== 'default' // .md files may have "side-exports" such as `export { frontmatter }`
        const configName = isSideExport ? exportName : configValueLoaded.configName
        if (isSideExport && configName in configValues) {
          // We can't avoid side-export conflicts upstream. (Because we cannot know about side-exports upstream at build-time.)
          // Side-exports have the lowest priority.
          return
        }
        addConfigValue(configName, exportValue, importPath, exportName)
      })
    } else {
      const { configName, importPath, importFileExportValue, exportName } = configValueLoaded
      addConfigValue(configName, importFileExportValue, importPath, exportName)
    }
  })

  return configValues
}

function assertIsNotNull(configValue: unknown, configName: string, importPath: string) {
  assert(!importPath.includes('+config.'))
  assertUsage(
    configValue !== null,
    `Set ${pc.cyan(configName)} to ${pc.cyan('null')} in a +config.h.js file instead of ${importPath}`
  )
}
