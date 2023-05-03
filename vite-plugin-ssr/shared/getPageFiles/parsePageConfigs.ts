// Counterpart: ../../node/plugin/plugins/importUserCode/v1-design/serializePageConfigs.ts

export { parsePageConfigs }

import { parse } from '@brillout/json-serializer/parse'
import type { ConfigElement, PageConfig } from '../page-configs/PageConfig'
import { assert, assertUsage, hasProp, isCallable } from '../utils'

function parsePageConfigs(pageConfigs: PageConfig[]) {
  pageConfigs.forEach((pageConfig) => {
    Object.entries(pageConfig.configElements).forEach(([configName, configElement]) => {
      parseConfigValue(configElement)
      if (configName === 'route') {
        assertRouteConfigValue(configElement)
      }
    })
  })
}

function parseConfigValue(configElement: ConfigElement) {
  const { configValueSerialized } = configElement
  if (configValueSerialized !== undefined) {
    configElement.configValue = parse(configValueSerialized)
  }
}

function assertRouteConfigValue(configElement: ConfigElement) {
  const { codeFilePath } = configElement
  if (!codeFilePath) return
  assert(hasProp(configElement, 'configValue')) // route files are eagerly loaded
  const { configValue } = configElement
  const configValueType = typeof configValue
  // TODO: validate earlier?
  assertUsage(
    configValueType === 'string' || isCallable(configValue),
    `${codeFilePath} has a default export with an invalid type '${configValueType}': the default export should be a string or a function`
  )
}
