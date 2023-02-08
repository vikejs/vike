export { configDefinitionsBuiltIn }
export type { ConfigDefinition }

import { assertUsage, isCallable } from '../../../utils'
import type { ConfigName, c_Env } from '../../../../../shared/page-configs/PageConfig'
import { assertRouteString } from '../../../../../shared/route/resolveRouteString'

// TODO: remove c_ prefix
type ConfigDefinition = {
  c_env: c_Env // TODO: rename to runtime? or runtimeEnv?
  c_global?: boolean // TODO: implement
  c_required?: boolean // TODO: apply validation
  c_code?: true // TODO: remove? Replace with `type: 'code'` or `type: 'file-path'`? A `type: 'boolean'` would be comfy for custom config 'ssr'`
  c_validate?: (
    configResolved: ({ configValue: unknown } | { configValue: string; codeFilePath: string }) & {
      configFilePath: string
    }
  ) => void | undefined
}

type ConfigDefinitionsBuiltIn = Record<ConfigName, ConfigDefinition>
const configDefinitionsBuiltIn: ConfigDefinitionsBuiltIn = {
  onRenderHtml: {
    c_code: true,
    c_required: true,
    c_env: 'server-only'
  },
  onRenderClient: {
    c_code: true,
    c_env: 'client-only'
  },
  onHydrationEnd: {
    c_code: true,
    c_env: 'client-only'
  },
  onPageTransitionStart: {
    c_code: true,
    c_env: 'client-only'
  },
  onPageTransitionEnd: {
    c_code: true,
    c_env: 'client-only'
  },
  onBeforeRender: {
    c_code: true,
    c_env: 'server-only'
  },
  onPrerender: {
    c_code: true,
    c_env: 'server-only'
  },
  Page: {
    c_code: true,
    c_env: 'server-and-client'
  },
  passToClient: {
    c_env: 'server-only'
  },
  route: {
    c_env: 'c_routing',
    c_validate: getRouteValidator()
  },
  iKnowThePerformanceRisksOfAsyncRouteFunctions: {
    c_env: 'server-and-client'
  },
  // TODO: rename to 'client'? I think so if client is cumulative to onRenderClient (while HTML-only needs to set `onRenderClient: null`)
  clientEntry: {
    c_code: true,
    c_env: 'client-only'
  },
  clientRouting: {
    c_env: 'server-and-client'
  },
  prerender: {
    c_code: true,
    c_env: 'server-only'
  },
  hydrationCanBeAborted: {
    c_env: 'client-only'
  },
  isErrorPage: {
    c_env: 'c_routing'
  }
  /* TODO
  onBeforeRoute: {
    c_code: true,
    c_global: true,
    c_env: 'c_routing'
  }
  onBeforePrerender: {
    c_code: true,
    c_global: true,
    c_env: 'server-only'
  }
  */
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
