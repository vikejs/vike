export { pluginReplaceConstantsGlobalThis }
export { getCodeConstantsGlobalThis }
// Trick for loading the `declare global` below
export type _LoadDeclareGlobal__VIKE__IS = never

import type { Plugin } from 'vite'
import { isDebug } from '../../../utils/debug.js'
import { assert } from '../../../utils/assert.js'
import { getVikeConfigInternal, type VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { getConfigValueBuildTime } from '../../../shared-server-client/page-configs/getConfigValueBuildTime.js'
import { isViteServerSide_configEnvironment } from '../shared/isViteServerSide.js'
import type { RuntimeEnvRuntime } from './pluginVirtualFiles/getConfigValueSourcesRelevant.js'
import '../assertEnvVite.js'

declare global {
  /** Like `import.meta.env.DEV` but works for `node_modules/` packages with `ssr.external` */
  var __VIKE__IS_DEV: boolean
  /** Like `import.meta.env.SSR` but works for `node_modules/` packages with `ssr.external` */
  var __VIKE__IS_CLIENT: boolean
  var __VIKE__IS_DEBUG: boolean
  /** Whether the client gets the error page's pageContext from the server: the error page has a server-only hook and not every page is pre-rendered */
  var __VIKE__FETCH_PAGE_CONTEXT_OF_ERROR_PAGE_FROM_SERVER: boolean
  /** Whether the code was processed by Vite */
  var __VIKE__NO_EXTERNAL: true | undefined
}

type Constants = Record<`__VIKE__${string}`, boolean>

const isDebugVal = isDebug()

function pluginReplaceConstantsGlobalThis(): Plugin[] {
  let isDev: boolean
  return [
    {
      name: 'vike:pluginReplaceConstantsGlobalThis',
      config: {
        handler(config) {
          assert(typeof config._isDev === 'boolean')
          isDev = config._isDev
          // The `define` values don't apply to the Vite process
          Object.assign(globalThis, getConstants(isDev, false))
        },
      },
      configEnvironment: {
        order: 'pre',
        async handler(name, config) {
          const isClientSide = !isViteServerSide_configEnvironment(name, config)
          // In dev, the client's global entry sets the constants that depend on the Vike config instead, so that adding or removing a + file updates them
          const vikeConfig = isDev ? undefined : await getVikeConfigInternal()
          return {
            consumer: isClientSide ? 'client' : 'server',
            define: getDefine({ ...getConstants(isDev, isClientSide, vikeConfig), __VIKE__NO_EXTERNAL: true }),
          }
        },
      },
    },
  ]
}

function getCodeConstantsGlobalThis(vikeConfig: VikeConfigInternal, runtimeEnv: RuntimeEnvRuntime): string[] {
  const { environmentName, isDev } = runtimeEnv
  // The `define` values don't apply to node_modules/ packages with ssr.external
  if (environmentName !== 'client') return getCode(getConstants(isDev, false))
  // In production, the client's `define` values contain every constant
  if (!isDev) return []
  // In dev, the client's `define` values lack the constants that depend on the Vike config, see `configEnvironment` above
  return getCode(getConstants(isDev, true, vikeConfig))
}

function getConstants(isDev: boolean, isClientSide: boolean, vikeConfig?: VikeConfigInternal): Constants {
  return {
    __VIKE__IS_DEV: isDev,
    __VIKE__IS_DEBUG: isDebugVal,
    __VIKE__IS_CLIENT: isClientSide,
    ...(vikeConfig && {
      __VIKE__FETCH_PAGE_CONTEXT_OF_ERROR_PAGE_FROM_SERVER: isFetchPageContextOfErrorPageFromServer(vikeConfig),
    }),
  }
}

function isFetchPageContextOfErrorPageFromServer(vikeConfig: VikeConfigInternal) {
  const errorPage = vikeConfig._pageConfigs.find((pageConfig) => pageConfig.isErrorPage)
  if (!errorPage || getConfigValueBuildTime(errorPage, 'hasServerOnlyHook', 'boolean')?.value !== true) return false
  return !vikeConfig.prerenderContext.isPrerenderingEnabledForAllPages
}

function getDefine(constants: Constants): Record<string, string> {
  return Object.fromEntries(
    Object.entries(constants).map(([name, value]) => [`globalThis.${name}`, JSON.stringify(value)]),
  )
}

function getCode(constants: Constants): string[] {
  return Object.entries(getDefine(constants)).map(([key, value]) => `${key} = ${value};`)
}
