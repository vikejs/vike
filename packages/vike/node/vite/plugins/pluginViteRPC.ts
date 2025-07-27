export { pluginViteRPC }

// TODO/now: rename file

import type { RunnableDevEnvironment, Plugin, ViteDevServer, ResolvedConfig } from 'vite'
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
}
function pluginViteRPC(): Plugin {
  const runtimeFileWithDynamicImport = requireResolveVikeDistFile('dist/esm/node/runtime/globalContext.js')
  let config: ResolvedConfig
  return {
    name: 'vike:pluginViteRPC',
    configureServer(viteDevServer) {
      createViteRPC(viteDevServer, getViteRpcFunctions)
    },
    configResolved(config_) {
      config = config_
    },
    transform(code, id) {
      if (!config._isDev) return
      if (id !== runtimeFileWithDynamicImport) return
      if (isRunnableDevEnvironment(this.environment)) return
      // TODO/now use magic-string
      const codeMod = code.replaceAll('__VIKE__DYNAMIC_IMPORT', 'import')
      return codeMod
    },
  }
}
