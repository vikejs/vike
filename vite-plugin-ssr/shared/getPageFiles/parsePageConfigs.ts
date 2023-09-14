// Counterpart: ../../node/plugin/plugins/importUserCode/v1-design/serializePageConfigs.ts

export { parsePageConfigs }

import type { PageConfig } from '../page-configs/PageConfig.js'

function parsePageConfigs(pageConfigs: PageConfig[]) {
  // TODO: remove
  /*
  pageConfigs.forEach((pageConfig) => {
    Object.entries(pageConfig.configElements).forEach(([configName, configElement]) => {
      {
        const { configValueSerialized } = configElement
        if (configValueSerialized !== undefined) {
          configElement.configValue = parse(configValueSerialized)
        }
      }
      if (configName === 'route') {
        assertRouteConfigValue(configElement)
      }
    })
  })
  */
}

// TODO: use again
// function assertRouteConfigValue(configElement: ConfigElement) {
//   assert(hasProp(configElement, 'configValue')) // route files are eagerly loaded
//   const { configValue } = configElement
//   const configValueType = typeof configValue
//   assertUsage(
//     configValueType === 'string' || isCallable(configValue),
//     `${configElement.configDefinedAt} has an invalid type '${configValueType}': it should be a string or a function instead, see https://vite-plugin-ssr.com/route`
//   )
//   /* We don't do that to avoid unnecessarily bloating the client-side bundle when using Server Routing
//    *  - When using Server Routing, this file is loaded as well
//    *  - When using Server Routing, client-side validation is superfluous as Route Strings only need to be validated on the server-side
//   if (typeof configValue === 'string') {
//     assertRouteString(configValue, `${configElement.configDefinedAt} defines an`)
//   }
//   */
// }
