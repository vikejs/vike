export { pluginNonRunnableDev }

import type { Plugin, ViteDevServer, ResolvedConfig } from 'vite'
import {
  createViteRPC,
  assertIsNotProductionRuntime,
  requireResolveVikeDistFile,
  isRunnableDevEnvironment,
} from '../utils.js'
import type { ClientDependency } from '../../../shared/getPageFiles/analyzePageClientSide/ClientDependency.js'
import { resolveClientEntriesDev } from '../shared/resolveClientEntriesDev.js'
import { retrieveAssetsDev } from '../../runtime/renderPage/getPageAssets/retrieveAssetsDev.js'
import { getViteConfigRuntime } from '../shared/getViteConfigRuntime.js'
import { getMagicString } from '../shared/getMagicString.js'
assertIsNotProductionRuntime()

export type ViteRPC = ReturnType<typeof getViteRpcFunctions>
function getViteRpcFunctions(viteDevServer: ViteDevServer) {
  return {
    async transformIndexHtmlRPC(html: string) {
      return await viteDevServer.transformIndexHtml('/', html)
    },
    async retrievePageAssetsDevRPC(clientDependencies: ClientDependency[], clientEntries: string[]) {
      const clientEntriesSrc = clientEntries.map((clientEntry) => resolveClientEntriesDev(clientEntry, viteDevServer))
      const assetUrls = await retrieveAssetsDev(clientDependencies, viteDevServer)
      return { clientEntriesSrc, assetUrls }
    },
    async getViteConfigRuntimeRPC() {
      const viteConfigRuntime = getViteConfigRuntime(viteDevServer.config)
      return viteConfigRuntime
    },
  }
}

declare global {
  var __VIKE__DYNAMIC_IMPORT: (module: string) => Promise<Record<string, unknown>>
  var __VIKE__IS_NON_RUNNABLE_DEV: undefined | boolean
}
function pluginNonRunnableDev(): Plugin {
  const runtimeFileWithDynamicImport = requireResolveVikeDistFile('dist/esm/node/runtime/globalContext.js')
  let config: ResolvedConfig
  return {
    name: 'vike:pluginNonRunnableDev',
    configureServer(viteDevServer) {
      createViteRPC(viteDevServer, getViteRpcFunctions)
    },
    configResolved(config_) {
      config = config_
    },
    transform(code, id) {
      if (!config._isDev) return
      if (id !== runtimeFileWithDynamicImport) return
      const isNonRunnableDev = !isRunnableDevEnvironment(this.environment)
      const { magicString, getMagicStringResult } = getMagicString(code, id)
      if (isNonRunnableDev) {
        /* Workaround for what seems to be a Vite bug:
           ```js
           assert(false)
           // This line breaks the HMR of regular (runnable) apps, even though (as per the assert() above) it's never run. It seems to be a Vite bug: handleHotUpdate() receives an empty `modules` list.
           import('virtual:vike:entry:server')
           ```
        */
        magicString.replaceAll('__VIKE__DYNAMIC_IMPORT', 'import')
      }
      magicString.replaceAll('__VIKE__IS_NON_RUNNABLE_DEV', JSON.stringify(isNonRunnableDev))
      return getMagicStringResult()
    },
  }
}
