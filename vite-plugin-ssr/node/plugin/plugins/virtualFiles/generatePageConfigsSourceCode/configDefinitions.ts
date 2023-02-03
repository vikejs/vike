export { configDefinitions }
export type { ConfigSpec }
export type { ConfigName }

import { assertUsage, isCallable } from '../../../utils'
import type { c_Env } from '../../../../../shared/page-configs/PageConfig'
import { assertRouteString } from '../../../../../shared/route/resolveRouteString'

// TODO: remove c_ prefix
type ConfigSpec = {
  c_env: c_Env
  c_global?: boolean // TODO: implement
  c_required?: boolean // TODO: apply validation
  c_code?: boolean // TODO: remove? Or rename to `type: 'code'`
  c_validate?: (
    configResolved: ({ configValue: unknown } | { configValue: string; codeFilePath: string }) & {
      configFilePath: string
    }
  ) => void | undefined
}
type ConfigName = keyof typeof configDefinitions_

const configDefinitions_ = {
  onRenderHtml: {
    c_code: true,
    c_required: true,
    c_env: 'server-only' as const
  },
  onRenderClient: {
    c_code: true,
    c_env: 'client-only' as const
  },
  Page: {
    c_code: true,
    c_env: 'server-and-client' as const
  },
  passToClient: {
    c_code: false,
    c_env: 'server-only' as const
  },
  route: {
    c_code: false,
    c_env: 'routing' as const,
    c_validate: getRouteValidator()
  },
  iKnowThePerformanceRisksOfAsyncRouteFunctions: {
    c_code: false,
    c_env: 'server-and-client' as const
  },
  // TODO: rename to 'client'? I think so if client is cumulative to onRenderClient (while HTML-only needs to set `onRenderClient: null`)
  clientEntry: {
    c_code: true,
    c_env: 'client-only' as const
  },
  clientRouting: {
    c_code: false,
    c_env: 'server-and-client' as const
  }
  /* TODO
  htmlFirst: {
  }
  onBeforeRoute: {
    c_code: true,
    c_global: true,
    c_env: 'routing'
  }
  onBeforeRender: {
    c_code: true,
    c_env: 'server-only'
  },
  */
}
const configDefinitions: Record<ConfigName, ConfigSpec> = configDefinitions_

function getRouteValidator() {
  const validateRoute: ConfigSpec['c_validate'] = (configResolved) => {
    const { configFilePath, configValue } = configResolved
    if ('codeFilePath' in configResolved) return
    if (typeof configValue === 'string') {
      assertRouteString(configValue, `${configFilePath} defines an`)
    } else {
      if (isCallable(configValue)) {
        const routeFunctionName = configValue.name || 'myRouteFunction'
        // TODO/v1: point to https://vite-plugin-ssr.com/route-function
        // TODO: write https://vite-plugin-ssr.com/v1-design
        assertUsage(
          false,
          `${configFilePath} sets a Route Function directly \`route: function ${routeFunctionName}() { /* ... */ }\` which is forbidden: instead define a file \`route: './path/to/route-file.js'\` that exports your Route Function \`export default ${routeFunctionName}() { /* ... */ }\`. See https://vite-plugin-ssr.com/v1-design for more information.`
        )
      }
      // TODO/v1: point to https://vite-plugin-ssr.com/routing#route-strings-route-functions
      // TODO: write https://vite-plugin-ssr.com/v1-design
      assertUsage(
        false,
        `${configFilePath} sets the configuration 'route' to a value with an invalid type \`${typeof configValue}\`: the value should be a string (a Route String or the path of a route file exporting a Route Function). See https://vite-plugin-ssr.com/v1-design for more information.`
      )
    }
  }
  return validateRoute
}
