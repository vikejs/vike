export { configDefinitionsBuiltIn }
export type { ConfigDefinition }

import { assertUsage, isCallable } from '../../../../utils'
import type { ConfigName, ConfigValueEnv } from '../../../../../../shared/page-configs/PageConfig'
import { assertRouteString } from '../../../../../../shared/route/resolveRouteString'

// TODO: remove c_ prefix
type ConfigDefinition = {
  env: ConfigValueEnv // TODO: rename to runtime? or runtimeEnv?
  c_global?: boolean // TODO: implement
  c_required?: boolean // TODO: apply validation
  c_code?: true // TODO: remove? Replace with `type: 'code'` or `type: 'file-path'`? A `type: 'boolean'` would be comfy for custom config 'ssr'`
  c_validate?: (
    configResolved: ({ configValue: unknown } | { configValue: string; codeFilePath: string }) & {
      configFilePath: string
    }
  ) => void | undefined
  effect?: (config: {
    configValue: unknown
    configDefinedAt: string
  }) => undefined | Record<string, Partial<ConfigDefinition>>
}

type ConfigDefinitionsBuiltIn = Record<ConfigName, ConfigDefinition>
const configDefinitionsBuiltIn: ConfigDefinitionsBuiltIn = {
  onRenderHtml: {
    c_code: true,
    c_required: true,
    env: 'server-only'
  },
  onRenderClient: {
    c_code: true,
    env: 'client-only'
  },
  onHydrationEnd: {
    c_code: true,
    env: 'client-only'
  },
  onPageTransitionStart: {
    c_code: true,
    env: 'client-only'
  },
  onPageTransitionEnd: {
    c_code: true,
    env: 'client-only'
  },
  onBeforeRender: {
    c_code: true,
    env: 'server-only'
  },
  onBeforePrerenderStart: {
    c_code: true,
    env: 'server-only'
  },
  Page: {
    c_code: true,
    env: 'server-and-client'
  },
  passToClient: {
    env: 'server-only'
  },
  route: {
    env: '_routing-env',
    c_validate: getRouteValidator()
  },
  iKnowThePerformanceRisksOfAsyncRouteFunctions: {
    env: 'server-and-client'
  },
  // TODO: rename to 'client'? I think so if client is cumulative to onRenderClient (while HTML-only needs to set `onRenderClient: null`)
  clientEntry: {
    c_code: true,
    env: 'client-only'
  },
  clientRouting: {
    env: 'server-and-client' // TODO: config-only instead?
  },
  prerender: {
    env: 'config-only'
  },
  hydrationCanBeAborted: {
    env: 'client-only' // TODO: config-only instead?
  },
  isErrorPage: {
    env: 'config-only' // TODO: config-only instead?
  }
}

function getRouteValidator() {
  const validateRoute: ConfigDefinition['c_validate'] = (configResolved) => {
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
