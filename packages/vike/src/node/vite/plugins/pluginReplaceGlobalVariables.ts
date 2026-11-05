export { pluginReplaceGlobalVariables }
export { getVirtualModuleCodeGlobalVariables }
// Trick for loading the `declare global` below
export type _LoadDeclareGlobal__VIKE__IS = never

import type { Plugin, ResolvedConfig } from 'vite'
import { isDebug } from '../../../utils/debug.js'
import { assert } from '../../../utils/assert.js'
import { getGlobalObject } from '../../../utils/getGlobalObject.js'
import { pick } from '../../../utils/pick.js'
import { escapeRegex } from '../../../utils/escapeRegex.js'
import { addVirtualFileIdPrefix } from '../../../utils/virtualFileId.js'
import { getVikeConfigInternal, type VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { getConfigValueBuildTime } from '../../../shared-server-client/page-configs/getConfigValueBuildTime.js'
import { isViteServerSide_configEnvironment, isViteServerSide_extraSafe } from '../shared/isViteServerSide.js'
import { getViteContext_ifKnown } from '../../api/resolveViteConfigUser.js'
import '../assertEnvVite.js'
const globalObject = getGlobalObject<{ globalVariablesBefore: Partial<GlobalVariables> }>(
  'pluginReplaceGlobalVariables.ts',
  {
    globalVariablesBefore: {},
  },
)
const virtualFileIdGlobalVariables = 'virtual:vike:global-variables'

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

// Stay the same inside this process
const CONSTANTS = ['__VIKE__IS_DEBUG', '__VIKE__IS_DEV'] as const
// Might change without a server restart
const NEEDS_HMR = ['__VIKE__FETCH_PAGE_CONTEXT_OF_ERROR_PAGE_FROM_SERVER'] as const

type GlobalVariables = Record<`__VIKE__${string}`, boolean>
function getGlobalVariables(
  isClientSide: boolean,
  isDev: boolean | null,
  vikeConfig: VikeConfigInternal | null,
): GlobalVariables {
  const globalVariables: GlobalVariables = {
    __VIKE__IS_DEBUG: isDebug(),
    __VIKE__IS_CLIENT: isClientSide,
  }
  if (isDev !== null) {
    globalVariables.__VIKE__IS_DEV = isDev
  }
  if (isClientSide) {
    assert(vikeConfig)
    globalVariables.__VIKE__FETCH_PAGE_CONTEXT_OF_ERROR_PAGE_FROM_SERVER =
      isFetchPageContextOfErrorPageFromServer(vikeConfig)
  }
  assertSameAsBefore(globalVariables)
  return globalVariables
}

// Support:
// - The Vite process, early on
{
  const viteContext = getViteContext_ifKnown()
  Object.assign(globalThis, getGlobalVariables(false, viteContext === null ? null : viteContext === 'dev', null))
}

function pluginReplaceGlobalVariables(): Plugin[] {
  let config: ResolvedConfig
  let vikeConfig: VikeConfigInternal | undefined
  let isDev: boolean
  return [
    {
      name: 'vike:pluginReplaceGlobalVariables',

      // Support:
      // - The Vite process
      config: {
        handler(config) {
          assert(typeof config._isDev === 'boolean')
          isDev = config._isDev
          Object.assign(globalThis, getGlobalVariables(false, isDev, null))
        },
      },

      // Support:
      // - Production with tree-shaking
      // - __VIKE__NO_EXTERNAL
      // - Code that reads global variables before virtual:vike:global-entry assigns them, for example:
      //   - @brillout/picocolors on Cloudflare Workers
      //     https://github.com/brillout/picocolors/blob/c4fdac83c00578769b6edc5f57702b7f703fa640/picocolors.ts#L5-L6
      //   - vike-react-zustand imported by +client (theoretical example, not a real-world example)
      //     https://github.com/vikejs/vike-react/blob/6fe2ff3ce6bd1b5f05055f867c5fbd07d4f101cd/packages/vike-react-zustand/src/getOrCreateStore.ts#L15
      configEnvironment: {
        order: 'pre',
        async handler(name, config) {
          const isClientSide = !isViteServerSide_configEnvironment(name, config)
          vikeConfig ??= await getVikeConfigInternal()

          const globalVariables: GlobalVariables = {
            ...getGlobalVariables(isClientSide, isDev, vikeConfig),
            __VIKE__NO_EXTERNAL: true,
          }

          if (isDev) {
            // Let getVirtualModuleCodeGlobalVariables() inject NEEDS_HMR into the virtual:vike:global-entry module
            // - Because `define` doesn't support HMR
            NEEDS_HMR.forEach((key) => delete globalVariables[key])
          }

          return {
            consumer: isClientSide ? 'client' : 'server',
            define: getDefine(globalVariables),
          }
        },
      },

      // See getVirtualModuleCodeGlobalVariables()
      configResolved(config_) {
        config = config_
      },
      load: {
        filter: {
          id: { include: [new RegExp(`^${escapeRegex(addVirtualFileIdPrefix(virtualFileIdGlobalVariables))}$`)] },
        },
        handler(_id, options) {
          const isClientSide = !isViteServerSide_extraSafe(config, this.environment, options)
          assert(!isDev) // We inject and import the virtual module only in prod
          assert(!isClientSide) // We inject and import the virtual module only on the server-side
          assert(vikeConfig)
          return getCode(getGlobalVariables(isClientSide, isDev, vikeConfig)).join('\n')
        },
      },
    },
  ]
}

// Support:
// - Dev with HMR
// - node_modules/ packages with ssr.external
function getVirtualModuleCodeGlobalVariables(
  isClientSide: boolean,
  isDev: boolean,
  vikeConfig: VikeConfigInternal,
  importStatements: string[],
): string[] {
  let globalVariables = getGlobalVariables(isClientSide, isDev, vikeConfig)
  if (isClientSide) {
    if (isDev) {
      // NEEDS_HMR is excluded from `define` above
      globalVariables = pick(globalVariables, NEEDS_HMR)
      return getCode(globalVariables)
    } else {
      // Save client-side KBs: the `define` above is enough (since client code is always `noExternal`)
      return []
    }
  } else {
    // node_modules/ packages with ssr.external
    if (isDev) {
      // Directly inject into the virtual:vike:global-entry module, instead of using a virtual module (see below) => HMR support (Vike invalidates the virtual:vike:global-entry module when the configuration changes)
      return getCode(globalVariables)
    } else {
      // Use a virtual module, instead of directly injecting into the virtual:vike:global-entry module (see above)
      // - In order to eagerly set the global variables, so that the top-level of modules can access the global variables (because the imports of virtual:vike:global-entry are executed before the virtual:vike:global-entry module body)
      // - Not needed in dev:
      //   - This module (the Vite process) already assigns the global variables
      //   - Cloudflare Workers => 100% noExternal => global variables are set via `define`
      //     - So far, the NEEDS_HMR variables are only used on the client-side
      assert(importStatements.length === 0) // It's best if it's the first import, so that any subsequent import can access the global variables
      importStatements.push(`import '${virtualFileIdGlobalVariables}';`)
      return []
    }
  }
}

// Utils
function assertSameAsBefore(globalVariables: GlobalVariables) {
  const { globalVariablesBefore } = globalObject
  for (const key of CONSTANTS) {
    const now = globalVariables[key]
    assert(now !== null)
    if (now === undefined) continue
    const prev = globalVariablesBefore[key]
    assert(prev === undefined || prev === now)
    globalVariablesBefore[key] ??= now
  }
}
function isFetchPageContextOfErrorPageFromServer(vikeConfig: VikeConfigInternal) {
  const errorPage = vikeConfig._pageConfigs.find((pageConfig) => pageConfig.isErrorPage)
  if (!errorPage || getConfigValueBuildTime(errorPage, 'hasServerOnlyHook', 'boolean')?.value !== true) return false
  return !vikeConfig.prerenderContext.isPrerenderingEnabledForAllPages
}
function getDefine(globalVariables: GlobalVariables): Record<string, string> {
  return Object.fromEntries(
    Object.entries(globalVariables).map(([name, value]) => [`globalThis.${name}`, JSON.stringify(value)]),
  )
}
function getCode(globalVariables: GlobalVariables): string[] {
  return Object.entries(getDefine(globalVariables)).map(([key, value]) => `${key} = ${value};`)
}
