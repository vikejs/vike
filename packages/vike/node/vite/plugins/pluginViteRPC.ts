export { pluginViteRPC }

import type { Plugin, ViteDevServer } from 'vite'
import { createViteRPC, assertIsNotProductionRuntime } from '../utils.js'
import type { ClientDependency } from '../../../shared/getPageFiles/analyzePageClientSide/ClientDependency.js'
import { resolveClientEntriesDev } from '../shared/resolveClientEntriesDev.js'
import { retrieveAssetsDev } from '../../runtime/renderPage/getPageAssets/retrieveAssetsDev.js'
assertIsNotProductionRuntime()

export type ViteRpc = ReturnType<typeof getRpcFunctions>
function getRpcFunctions(viteDevServer: ViteDevServer) {
  return {
    async transformIndexHtml(html: string) {
      return await viteDevServer.transformIndexHtml('/', html)
    },
    async retrievePageAssetsDevRpc(clientDependencies: ClientDependency[], clientEntries: string[]) {
      const clientEntriesSrc = clientEntries.map((clientEntry) => resolveClientEntriesDev(clientEntry, viteDevServer))
      const assetUrls = await retrieveAssetsDev(clientDependencies, viteDevServer)
      return { clientEntriesSrc, assetUrls }
    },
  }
}

function pluginViteRPC(): Plugin {
  return {
    name: 'vike:pluginViteRPC',
    configureServer(viteDevServer) {
      createViteRPC(viteDevServer, getRpcFunctions)
    },
  }
}
