export { pluginReplaceConstantsGlobalThis }
export { getCodeConstantsGlobalThis }
// Trick for loading the `declare global` below
export type _LoadDeclareGlobal__VIKE__IS = never

import type { Plugin } from 'vite'
import { isDebug } from '../../../utils/debug.js'
import { assert } from '../../../utils/assert.js'
import { getGlobalObject } from '../../../utils/getGlobalObject.js'
import { getVikeConfigInternal, type VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { getConfigValueBuildTime } from '../../../shared-server-client/page-configs/getConfigValueBuildTime.js'
import { isViteServerSide_configEnvironment } from '../shared/isViteServerSide.js'
import { getViteContext_ifKnown } from '../../api/resolveViteConfigUser.js'
import '../assertEnvVite.js'
const globalObject = getGlobalObject<{ constantsPrevious: Partial<Constants> }>('pluginReplaceConstantsGlobalThis.ts', {
  constantsPrevious: {},
})

declare global {
  var __VIKE__IS_DEBUG: boolean
  /** Like `import.meta.env.SSR` but works for `node_modules/` packages with `ssr.external` */
  var __VIKE__IS_CLIENT: boolean
  /** Like `import.meta.env.DEV` but works for `node_modules/` packages with `ssr.external` */
  var __VIKE__IS_DEV: boolean
  /** Whether the client gets the error page's pageContext from the server: the error page has a server-only hook and not every page is pre-rendered */
  var __VIKE__FETCH_PAGE_CONTEXT_OF_ERROR_PAGE_FROM_SERVER: boolean
  /** Whether the code was processed by Vite */
  var __VIKE__NO_EXTERNAL: true | undefined
}

type Constants = Record<`__VIKE__${string}`, boolean>
// The values that stay the same in a process
const CONSTANTS = ['__VIKE__IS_DEBUG', '__VIKE__IS_DEV'] as const
// The values that can change without a server restart
const NEEDS_HMR = ['__VIKE__FETCH_PAGE_CONTEXT_OF_ERROR_PAGE_FROM_SERVER'] as const
function getConstants(isClientSide: boolean, isDev: boolean | null, vikeConfig: VikeConfigInternal | null): Constants {
  const constants: Constants = {
    __VIKE__IS_DEBUG: isDebug(),
    __VIKE__IS_CLIENT: isClientSide,
  }
  if (isDev !== null) {
    constants.__VIKE__IS_DEV = isDev
  }
  if (isClientSide) {
    assert(vikeConfig)
    constants.__VIKE__FETCH_PAGE_CONTEXT_OF_ERROR_PAGE_FROM_SERVER = isFetchPageContextOfErrorPageFromServer(vikeConfig)
  }
  assertSameAsPrevious(constants)
  return constants
}
function assertSameAsPrevious(constants: Constants) {
  const { constantsPrevious } = globalObject
  for (const key of CONSTANTS) {
    const value = constants[key]
    // `__VIKE__IS_DEV` can be unset early on
    if (value === undefined) continue
    const valuePrevious = constantsPrevious[key]
    assert(valuePrevious === undefined || valuePrevious === value)
    constantsPrevious[key] = value
  }
}

// Support:
// - The Vite process, early on
//   - The Vike CLI, Vike's API and the Vite CLI name the command => `__VIKE__IS_DEV` is set
//   - Otherwise (e.g. Vite's JS API or Vitest) => `__VIKE__IS_DEV` stays unset until the `config` hook below
const viteContext = getViteContext_ifKnown()
Object.assign(globalThis, getConstants(false, viteContext === null ? null : viteContext === 'dev', null))

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
      // - Dev: code that reads constants before virtual:vike:global-entry assigns them, for example:
      //   - @brillout/picocolors on Cloudflare
      //     https://github.com/brillout/picocolors/blob/c4fdac83c00578769b6edc5f57702b7f703fa640/picocolors.ts#L5-L6
      //   - vike-react-zustand imported by +client
      //     https://github.com/vikejs/vike-react/blob/6fe2ff3ce6bd1b5f05055f867c5fbd07d4f101cd/packages/vike-react-zustand/src/getOrCreateStore.ts#L15
      configEnvironment: {
        order: 'pre',
        async handler(name, config) {
          const isClientSide = !isViteServerSide_configEnvironment(name, config)
          const vikeConfig = await getVikeConfigInternal()
          const constants: Constants = {
            ...getConstants(isClientSide, isDev, vikeConfig),
            __VIKE__NO_EXTERNAL: true,
          }
          if (isDev) {
            // Let getCodeConstantsGlobalThis() inject the Vike config's value in Vike's virtual:vike:global-entry module for HMR support
            NEEDS_HMR.forEach((key) => delete constants[key])
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
function getCodeConstantsGlobalThis(isClientSide: boolean, isDev: boolean, vikeConfig: VikeConfigInternal): string[] {
  if (isClientSide && !isDev) {
    // - Save client-side KBs: in production, the `define` above is enough (since client code is always `noExternal`)
    // - Not for server-side though, because of node_modules/ packages with ssr.external
    return []
  }
  return getCode(getConstants(isClientSide, isDev, vikeConfig))
}

// Utils
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
