export { parseConfigValuesImported }

import { assert } from '../../utils.js'
import { assertPlusFileExport } from '../assertPlusFileExport.js'
import type { ConfigValues, DefinedAtFile } from '../PageConfig.js'
import type { ConfigValueImported } from './PageConfigSerialized.js'

type ConfigValueUnmerged = {
  value: unknown
  importPath: string
  exportName: string
  isSideExport?: boolean
}

function parseConfigValuesImported(configValuesImported: ConfigValueImported[]): ConfigValues {
  const configValuesUnmerged: Record<
    // configName
    string,
    ConfigValueUnmerged[]
  > = {}
  configValuesImported
    .filter((c) => c.configName !== 'client')
    .forEach((configValueLoaded) => {
      if (configValueLoaded.isValueFile) {
        const { exportValues, importPath, configName } = configValueLoaded
        assertPlusFileExport(exportValues, importPath, configName)
        Object.entries(exportValues).forEach(([exportName, exportValue]) => {
          const configName = exportName !== 'default' ? exportName : configValueLoaded.configName
          const isSideExport = configName !== configValueLoaded.configName // .md files may have "side-exports" such as `export { frontmatter }`
          configValuesUnmerged[configName] ??= []
          configValuesUnmerged[configName]!.push({
            value: exportValue,
            importPath,
            exportName,
            isSideExport
          })
        })
      } else {
        const { configName, importPath, exportValue, exportName } = configValueLoaded
        configValuesUnmerged[configName] ??= []
        configValuesUnmerged[configName]!.push({
          value: exportValue,
          importPath,
          exportName,
          isSideExport: false
        })
      }
    })

  const configValues: ConfigValues = {}
  Object.entries(configValuesUnmerged).forEach(([configName, values]) => {
    const valuesWithoutSideExports = values.filter((v) => !v.isSideExport)
    const isCumulative = valuesWithoutSideExports.length > 1
    const noSideExports = valuesWithoutSideExports.length === values.length
    assert(!(configName in configValues))
    if (isCumulative) {
      // Vike currently doesn't support side exports for cumulative configs
      assert(noSideExports)
      configValues[configName] = {
        type: 'cumulative',
        value: valuesWithoutSideExports.map((val) => val.value),
        definedAtData: valuesWithoutSideExports.map((v) => getDefinedAtData(v, configName))
      }
    } else {
      const val =
        valuesWithoutSideExports[0] ??
        // We can't avoid side-export conflicts upstream. (We cannot know about side-exports at build-time.)
        // Side-exports have lower precedence.
        values[0]
      assert(val)
      const { value, importPath } = val
      configValues[configName] = {
        type: 'standard',
        value,
        definedAtData: getDefinedAtData(val, configName)
      }
      assertIsNotNull(value, configName, importPath)
    }
  })

  return configValues
}

function getDefinedAtData(configValueUnmerged: ConfigValueUnmerged, configName: string): DefinedAtFile {
  const { importPath, exportName } = configValueUnmerged
  return {
    // importPath cannot be relative to the current file, since the current file is a virtual file
    filePathToShowToUser: importPath,
    fileExportPathToShowToUser: [configName, 'default'].includes(exportName)
      ? []
      : [
          // Side-export
          exportName
        ]
  }
}

function assertIsNotNull(configValue: unknown, configName: string, importPath: string) {
  assert(!importPath.includes('+config.'))
  /* Re-use this for:
   *  - upcoming config.requestPageContextOnNavigation
   *  - for cumulative values in the future: we don't need this for now because, currently, cumulative values are never imported.
  assertUsage(
    configValue !== null,
    `Set ${pc.cyan(configName)} to ${pc.cyan('null')} in a +config.js file instead of ${importPath}`
  )
  */
}
