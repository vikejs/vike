export { parsePageConfigs }
export { parseConfigValuesSerialized }

import type {
  ConfigValues,
  PageConfigRuntime,
  PageConfigGlobalRuntime,
  ConfigValue,
  DefinedAtFile
} from '../PageConfig.js'
import type { PageConfigGlobalRuntimeSerialized, PageConfigRuntimeSerialized } from './PageConfigSerialized.js'
import { assert, assertUsage, isArray, isCallable } from '../../utils.js'
import { getConfigDefinedAt } from '../getConfigDefinedAt.js'
import type { ConfigValueSerialized } from './PageConfigSerialized.js'
import { parseTransform } from '@brillout/json-serializer/parse'
import { assertPlusFileExport } from '../assertPlusFileExport.js'
import type { ConfigValueImported } from './PageConfigSerialized.js'

type ConfigValueUnmerged = {
  value: unknown
  importPath: string
  exportName: string
  isSideExport?: boolean
}

function parseConfigValuesSerialized(
  configValuesSerialized: Record<string, ConfigValueSerialized>,
  configValuesImported: ConfigValueImported[]
): ConfigValues {
  const configValues: ConfigValues = {}
  {
    const configValuesAddendum = parseConfigValuesSerialized_tmp(configValuesSerialized)
    Object.assign(configValues, configValuesAddendum)
  }
  {
    const configValuesAddendum = parseConfigValuesImported(configValuesImported)
    Object.assign(configValues, configValuesAddendum)
  }
  return configValues
}

function parsePageConfigs(
  pageConfigsSerialized: PageConfigRuntimeSerialized[],
  pageConfigGlobalSerialized: PageConfigGlobalRuntimeSerialized
): { pageConfigs: PageConfigRuntime[]; pageConfigGlobal: PageConfigGlobalRuntime } {
  // pageConfigs
  const pageConfigs: PageConfigRuntime[] = pageConfigsSerialized.map((pageConfigSerialized) => {
    const configValues = parseConfigValuesSerialized(
      pageConfigSerialized.configValuesSerialized,
      pageConfigSerialized.configValuesImported
    )
    const { pageId, isErrorPage, routeFilesystem, loadConfigValuesAll } = pageConfigSerialized
    assertRouteConfigValue(configValues)
    return {
      pageId,
      isErrorPage,
      routeFilesystem,
      configValues,
      loadConfigValuesAll
    } satisfies PageConfigRuntime
  })

  // pageConfigsGlobal
  const pageConfigGlobal: PageConfigGlobalRuntime = { configValues: {} }
  {
    const configValues = parseConfigValuesSerialized({}, pageConfigGlobalSerialized.configValuesImported)
    Object.assign(pageConfigGlobal.configValues, configValues)
  }

  return { pageConfigs, pageConfigGlobal }
}

function assertRouteConfigValue(configValues: ConfigValues) {
  const configName = 'route'
  const configValue = configValues[configName]
  if (!configValue) return
  const { value, definedAtData } = configValue
  const configValueType = typeof value
  assert(definedAtData)
  const configDefinedAt = getConfigDefinedAt('Config', configName, definedAtData)
  assertUsage(
    configValueType === 'string' || isCallable(value),
    `${configDefinedAt} has an invalid type '${configValueType}': it should be a string or a function instead, see https://vike.dev/route`
  )
  /* We don't use assertRouteString() in order to avoid unnecessarily bloating the client-side bundle when using Server Routing:
  * - When using Server Routing, this file is loaded => loading assertRouteString() would bloat the client bundle.
  * - assertRouteString() is already called on the server-side
  * - When using Server Routing, client-side validation is superfluous as Route Strings only need to be validated on the server-side
 if (typeof configValue === 'string') {
   assertRouteString(configValue, `${configElement.configDefinedAt} defines an`)
 }
 */
}

function parseConfigValuesSerialized_tmp(configValuesSerialized: Record<string, ConfigValueSerialized>): ConfigValues {
  const configValues: ConfigValues = {}
  Object.entries(configValuesSerialized).forEach(([configName, configValueSeriliazed]) => {
    assert(!configValues[configName])
    const { valueSerialized, ...common } = configValueSeriliazed
    const value = parseTransform(valueSerialized)
    let configValue: ConfigValue
    if (common.type === 'cumulative') {
      assert(isArray(value))
      configValue = { value, ...common }
    } else {
      configValue = { value, ...common }
    }
    configValues[configName] = configValue
  })
  return configValues
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
