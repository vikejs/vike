export { parseConfigValuesImported }

import { assert, assertUsage } from '../../utils.js'
import { assertExportsOfValueFile } from '../assertExports.js'
import type { ConfigValues } from '../PageConfig.js'
import type { ConfigValueImported } from './PageConfigSerialized.js'
import pc from '@brillout/picocolors'

function parseConfigValuesImported(configValuesImported: ConfigValueImported[]): ConfigValues {
  const configValues: ConfigValues = {}

  const addConfigValue = (configName: string, value: unknown, importPath: string, exportName: string) => {
    configValues[configName] = {
      value,
      definedAt: {
        source: {
          // importPath cannot be relative to the current file, since the current file is a virtual file
          filePathToShowToUser: importPath,
          fileExportPath: [configName, 'default'].includes(exportName)
            ? []
            : // Side-effect config
              [exportName]
        }
      }
    }
    assertIsNotNull(value, configName, importPath)
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
