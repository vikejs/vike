export { pluginNonRunnableDev }

// TODO/now refactor to match Telefunc's copy

import type { Plugin, ViteDevServer, ResolvedConfig } from 'vite'
import { createViteRPC, isRunnableDevEnvironment, assert, isDevCheck } from '../utils.js'
import type { ClientDependency } from '../../../shared/getPageFiles/analyzePageClientSide/ClientDependency.js'
import { retrievePageAssetsDev } from '../../runtime/renderPage/getPageAssets/retrievePageAssetsDev.js'
import { getViteConfigRuntime } from '../shared/getViteConfigRuntime.js'
import { getMagicString } from '../shared/getMagicString.js'

/* We cannot use [`filter.id`](https://rolldown.rs/plugins/hook-filters) because Vite's optimizeDeps bundles the package `vike` into node_modules/.vite/deps_ssr/chunk-WBC5FHD7.js
const distFileIsNonRunnableDev = requireResolveDistFile('dist/esm/utils/isNonRunnableDev.js')
const distFileGlobalContext = requireResolveDistFile('dist/esm/node/runtime/globalContext.js')
const filterRolldown = {
  id: {
    include: [distFileIsNonRunnableDev, distFileGlobalContext].map(
      (filePath) => new RegExp(`^${escapeRegex(filePath)}($|${escapeRegex('?')}.*)`),
    ),
  },
}
*/

const __VIKE__DYNAMIC_IMPORT = '__VIKE__DYNAMIC_IMPORT'
const __VIKE__IS_NON_RUNNABLE_DEV = '__VIKE__IS_NON_RUNNABLE_DEV'

export type ViteRPC = ReturnType<typeof getViteRpcFunctions>
function getViteRpcFunctions(viteDevServer: ViteDevServer) {
  return {
    async transformIndexHtmlRPC(html: string) {
      return await viteDevServer.transformIndexHtml('/', html)
    },
    async retrievePageAssetsDevRPC(clientDependencies: ClientDependency[], clientEntries: string[]) {
      return await retrievePageAssetsDev(viteDevServer, clientDependencies, clientEntries)
    },
    async getViteConfigRuntimeRPC() {
      return getViteConfigRuntime(viteDevServer.config)
    },
  }
}

declare global {
  var __VIKE__DYNAMIC_IMPORT: (module: string) => Promise<Record<string, unknown>>
  var __VIKE__IS_NON_RUNNABLE_DEV: undefined | boolean
}
function pluginNonRunnableDev(): Plugin[] {
  let config: ResolvedConfig
  return [
    {
      name: 'vike:pluginNonRunnableDev:1',
      apply: (_, configEnv) => isDevCheck(configEnv),
      configureServer: {
        handler(viteDevServer) {
          createViteRPC(viteDevServer, getViteRpcFunctions)
        },
      },
      configResolved: {
        handler(config_) {
          config = config_
        },
      },
      transform: {
        filter: {
          code: {
            include: __VIKE__IS_NON_RUNNABLE_DEV,
          },
        },
        handler(code, id) {
          assert(config._isDev)
          if (isRunnableDevEnvironment(this.environment)) return
          const { magicString, getMagicStringResult } = getMagicString(code, id)
          magicString.replaceAll(__VIKE__IS_NON_RUNNABLE_DEV, JSON.stringify(true))
          return getMagicStringResult()
        },
      },
    },
    {
      name: 'vike:pluginNonRunnableDev:2',
      apply: (_, configEnv) => isDevCheck(configEnv),
      transform: {
        filter: {
          code: {
            include: __VIKE__DYNAMIC_IMPORT,
          },
        },
        handler(code, id) {
          assert(config._isDev)
          if (isRunnableDevEnvironment(this.environment)) return
          const { magicString, getMagicStringResult } = getMagicString(code, id)
          magicString.replaceAll(__VIKE__DYNAMIC_IMPORT, 'import')
          return getMagicStringResult()
        },
      },
    },
  ]
}
