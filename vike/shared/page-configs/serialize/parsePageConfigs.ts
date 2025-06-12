export { parsePageConfigs }
export { parseConfigValuesSerialized }

import type {
  ConfigValues,
  PageConfigRuntime,
  PageConfigGlobalRuntime,
  ConfigValue,
  DefinedAt,
} from '../../../types/PageConfig.js'
import type {
  PageConfigGlobalRuntimeSerialized,
  PageConfigRuntimeSerialized,
  ValueSerialized,
} from './PageConfigSerialized.js'
import { assert, assertUsage, isCallable } from '../../utils.js'
import { getConfigDefinedAt } from '../getConfigDefinedAt.js'
import type { ConfigValueSerialized } from './PageConfigSerialized.js'
import { parseTransform } from '@brillout/json-serializer/parse'
import { assertPlusFileExport } from '../assertPlusFileExport.js'

function parsePageConfigs(
  pageConfigsSerialized: PageConfigRuntimeSerialized[],
  pageConfigGlobalSerialized: PageConfigGlobalRuntimeSerialized,
): {
  pageConfigs: PageConfigRuntime[]
  pageConfigGlobal: PageConfigGlobalRuntime
} {
  // pageConfigs
  const pageConfigs: PageConfigRuntime[] = pageConfigsSerialized.map((pageConfigSerialized) => {
    const configValues = parseConfigValuesSerialized(pageConfigSerialized.configValuesSerialized)
    assertRouteConfigValue(configValues)
    const pageConfig = { ...pageConfigSerialized, configValues }
    return pageConfig
  })

  // pageConfigsGlobal
  const pageConfigGlobal: PageConfigGlobalRuntime = { configValues: {} }
  {
    const configValues = parseConfigValuesSerialized(pageConfigGlobalSerialized.configValuesSerialized)
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
    `${configDefinedAt} has an invalid type '${configValueType}': it should be a string or a function instead, see https://vike.dev/route`,
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

function parseConfigValuesSerialized(configValuesSerialized: Record<string, ConfigValueSerialized>): ConfigValues {
  const configValues: ConfigValues = {}

  Object.entries(configValuesSerialized).forEach(([configName, configValueSeriliazed]) => {
    let configValue: ConfigValue
    if (configValueSeriliazed.type === 'cumulative') {
      const { valueSerialized, ...common } = configValueSeriliazed
      const value = valueSerialized.map((valueSerializedElement, i) => {
        const { value, sideExports } = parseValueSerialized(valueSerializedElement, configName, () => {
          const definedAtFile = configValueSeriliazed.definedAtData[i]
          assert(definedAtFile)
          return definedAtFile
        })
        addSideExports(sideExports)
        return value
      })
      configValue = { value, ...common }
    } else {
      const { valueSerialized, ...common } = configValueSeriliazed
      const { value, sideExports } = parseValueSerialized(valueSerialized, configName, () => {
        assert(configValueSeriliazed.type !== 'computed')
        const { definedAtData } = configValueSeriliazed
        const definedAtFile = Array.isArray(definedAtData) ? definedAtData[0]! : definedAtData
        return definedAtFile
      })
      addSideExports(sideExports)
      configValue = { value, ...common }
    }
    configValues[configName] = configValue
  })

  return configValues

  function addSideExports(sideExports: SideExport[]) {
    sideExports.forEach((sideExport) => {
      const { configName, configValue } = sideExport
      if (!configValues[configName]) {
        configValues[configName] = configValue
      } else {
        // Side-exports have lower precedence.
        // We can't avoid side-export conflicts upstream. (We cannot know about side-exports at build-time.)
      }
    })
  }
}

type SideExport = {
  configName: string
  configValue: ConfigValue
}
function parseValueSerialized(
  valueSerialized: ValueSerialized,
  configName: string,
  getDefinedAtFile: () => DefinedAt,
): { value: unknown; sideExports: SideExport[] } {
  if (valueSerialized.type === 'js-serialized') {
    let { value } = valueSerialized
    value = parseTransform(value)
    return { value, sideExports: [] }
  }
  if (valueSerialized.type === 'pointer-import') {
    const { value } = valueSerialized
    return { value, sideExports: [] }
  }
  if (valueSerialized.type === 'plus-file') {
    const definedAtFile = getDefinedAtFile()
    const { exportValues } = valueSerialized
    assert(!definedAtFile.definedBy)
    assertPlusFileExport(exportValues, definedAtFile.filePathToShowToUser, configName)
    let value: unknown
    let valueWasFound = false
    const sideExports: SideExport[] = []
    Object.entries(exportValues).forEach(([exportName, exportValue]) => {
      const isSideExport = exportName !== 'default' && exportName !== configName
      if (!isSideExport) {
        value = exportValue
        // Already asserted by assertPlusFileExport() call above.
        assert(!valueWasFound)
        valueWasFound = true
      } else {
        sideExports.push({
          configName: exportName,
          configValue: {
            type: 'standard', // We don't support side exports for cumulative values. We could support it but it isn't trivial.
            value: exportValue,
            definedAtData: {
              filePathToShowToUser: definedAtFile.filePathToShowToUser,
              fileExportPathToShowToUser: [exportName],
            },
          },
        })
      }
    })
    // Already asserted by assertPlusFileExport() call above.
    assert(valueWasFound)
    return { value, sideExports }
  }
  assert(false)
}

/* [NULL_HANDLING] Do we really need this?
function assertIsNotNull(configValue: unknown, configName: string, filePathToShowToUser: string) {
  assert(!filePathToShowToUser.includes('+config.'))
  // Re-use this for:
  //  - upcoming config.requestPageContextOnNavigation
  //  - for cumulative values in the future: we don't need this for now because, currently, cumulative values are never imported.
  assertUsage(
    configValue !== null,
    `Set ${pc.cyan(configName)} to ${pc.cyan('null')} in a +config.js file instead of ${filePathToShowToUser}`
  )
}
*/
