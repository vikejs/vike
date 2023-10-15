export { parsePageConfigsSerialized }

import type {
  ConfigValues,
  PageConfig,
  PageConfigGlobal,
  PageConfigGlobalSerialized,
  PageConfigSerialized
} from '../page-configs/PageConfig.js'
import { parse } from '@brillout/json-serializer/parse'
import { processConfigValuesImported } from '../page-configs/loadPageCode.js'
import { assert } from '../utils.js'

function parsePageConfigsSerialized(
  pageConfigsSerialized: PageConfigSerialized[],
  pageConfigGlobalSerialized: PageConfigGlobalSerialized
): { pageConfigs: PageConfig[]; pageConfigGlobal: PageConfigGlobal } {
  const pageConfigs: PageConfig[] = pageConfigsSerialized.map((pageConfigSerialized) => {
    const configValues: ConfigValues = {}
    {
      const { configValuesSerialized } = pageConfigSerialized
      Object.entries(configValuesSerialized).forEach(([configName, configValueSeriliazed]) => {
        {
          const { valueSerialized, definedAtInfo } = configValueSeriliazed
          assert(valueSerialized)
          assert(!configValues[configName])
          configValues[configName] = {
            value: parse(valueSerialized),
            definedAtInfo
          }
        }
      })
    }
    {
      const { configValuesImported } = pageConfigSerialized
      const configValuesAddendum = processConfigValuesImported(configValuesImported)
      Object.assign(configValues, configValuesAddendum)
    }

    /* TODO
    if (configName === 'route') {
      assertRouteConfigValue(configElement)
    }
    */

    const { pageId, isErrorPage, routeFilesystem, loadConfigValuesAll } = pageConfigSerialized
    return {
      pageId,
      isErrorPage,
      routeFilesystem,
      configValues,
      loadConfigValuesAll
    } satisfies PageConfig
  })

  const pageConfigGlobal: PageConfigGlobal = { configValues: {} }
  {
    const configValuesAddendum = processConfigValuesImported(pageConfigGlobalSerialized.configValuesImported)
    Object.assign(pageConfigGlobal.configValues, configValuesAddendum)
  }

  return { pageConfigs, pageConfigGlobal }
}

// TODO: use again
// function assertRouteConfigValue(configElement: ConfigElement) {
//   assert(hasProp(configElement, 'configValue')) // route files are eagerly loaded
//   const { configValue } = configElement
//   const configValueType = typeof configValue
//   assertUsage(
//     configValueType === 'string' || isCallable(configValue),
//     `${configElement.configDefinedAt} has an invalid type '${configValueType}': it should be a string or a function instead, see https://vike.dev/route`
//   )
//   /* We don't do that to avoid unnecessarily bloating the client-side bundle when using Server Routing
//    *  - When using Server Routing, this file is loaded as well
//    *  - When using Server Routing, client-side validation is superfluous as Route Strings only need to be validated on the server-side
//   if (typeof configValue === 'string') {
//     assertRouteString(configValue, `${configElement.configDefinedAt} defines an`)
//   }
//   */
// }
