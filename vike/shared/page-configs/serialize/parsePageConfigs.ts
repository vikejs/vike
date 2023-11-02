export { parsePageConfigs }

import type { ConfigValues, PageConfigRuntime, PageConfigGlobalRuntime } from '../PageConfig.js'
import type { PageConfigGlobalRuntimeSerialized, PageConfigRuntimeSerialized } from './PageConfigSerialized.js'
import { parse } from '@brillout/json-serializer/parse'
import { parseConfigValuesImported } from './parseConfigValuesImported.js'
import { assert, assertUsage, isCallable } from '../../utils.js'
import { getConfigDefinedAtString } from '../helpers.js'

function parsePageConfigs(
  pageConfigsSerialized: PageConfigRuntimeSerialized[],
  pageConfigGlobalSerialized: PageConfigGlobalRuntimeSerialized
): { pageConfigs: PageConfigRuntime[]; pageConfigGlobal: PageConfigGlobalRuntime } {
  const pageConfigs: PageConfigRuntime[] = pageConfigsSerialized.map((pageConfigSerialized) => {
    const configValues: ConfigValues = {}
    {
      const { configValuesSerialized } = pageConfigSerialized
      Object.entries(configValuesSerialized).forEach(([configName, configValueSeriliazed]) => {
        {
          const { valueSerialized, definedAt } = configValueSeriliazed
          assert(valueSerialized)
          assert(!configValues[configName])
          configValues[configName] = {
            value: parse(valueSerialized),
            definedAt
          }
        }
      })
    }
    {
      const { configValuesImported } = pageConfigSerialized
      const configValuesAddendum = parseConfigValuesImported(configValuesImported)
      Object.assign(configValues, configValuesAddendum)
    }

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

  const pageConfigGlobal: PageConfigGlobalRuntime = { configValues: {} }
  {
    const configValuesAddendum = parseConfigValuesImported(pageConfigGlobalSerialized.configValuesImported)
    Object.assign(pageConfigGlobal.configValues, configValuesAddendum)
  }

  return { pageConfigs, pageConfigGlobal }
}

function assertRouteConfigValue(configValues: ConfigValues) {
  const configName = 'route'
  const configValue = configValues[configName]
  if (!configValue) return
  const { value } = configValue
  const configValueType = typeof value
  const configDefinedAt = getConfigDefinedAtString('Config', configName, configValue)
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
