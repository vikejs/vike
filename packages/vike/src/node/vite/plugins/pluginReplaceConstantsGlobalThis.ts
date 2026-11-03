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
import '../assertEnvVite.js'
import { objectAssign } from '../../../utils/objectAssign.js'

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
function getConstants(isClientSide: boolean, isDev: boolean, vikeConfig: VikeConfigInternal | null): Constants {
  const constants: Constants = {
    __VIKE__IS_DEV: isDev,
    __VIKE__IS_CLIENT: isClientSide,
    __VIKE__IS_DEBUG: isDebug(),
  }
  if (isClientSide) {
    assert(vikeConfig)
    constants.__VIKE__FETCH_PAGE_CONTEXT_OF_ERROR_PAGE_FROM_SERVER = isFetchPageContextOfErrorPageFromServer(vikeConfig)
  }
  return constants
}

function pluginReplaceConstantsGlobalThis(): Plugin[] {
  let isDev: boolean
  return [
    {
      name: 'vike:pluginReplaceConstantsGlobalThis',
      // Support:
      // - The Vite process
      config: {
        handler(config) {
          assert(typeof config._isDev === 'boolean')
          isDev = config._isDev
          Object.assign(globalThis, getConstants(false, isDev, null))
        },
      },
      // Support:
      // - Production with tree-shaking
      // - __VIKE__NO_EXTERNAL
      configEnvironment: {
        order: 'pre',
        async handler(name, config) {
          const isClientSide = !isViteServerSide_configEnvironment(name, config)
          const constants: Constants = {
            __VIKE__NO_EXTERNAL: true,
          }
          if (!isDev) {
            const vikeConfig = await getVikeConfigInternal()
            objectAssign(constants, getConstants(isClientSide, isDev, vikeConfig))
          } else {
            // Let getCodeConstantsGlobalThis() inject values in Vike's virtual:vike:global-entry module for HMR support
          }
          return {
            consumer: isClientSide ? 'client' : 'server',
            define: getDefine(constants),
          }
        },
      },
    },
  ]
}

// Support:
// - Dev with HMR
// - node_modules/ packages with ssr.external
function getCodeConstantsGlobalThis(isDev: boolean, isClientSide: boolean, vikeConfig: VikeConfigInternal): string[] {
  if (isClientSide && !isDev) {
    // - Save client-side KBs: in production, the `define` above is enough (since client code is always `noExternal`)
    // - Not for server-side though, because of node_modules/ packages with ssr.external
    return []
  }
  return getCode(getConstants(isClientSide, isDev, vikeConfig))
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
