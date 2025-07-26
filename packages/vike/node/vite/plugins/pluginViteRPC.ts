export { pluginViteRPC }

// TODO/now: rename file

import type { Plugin, ViteDevServer } from 'vite'
import { createViteRPC, assertIsNotProductionRuntime, requireResolveVikeDistFile } from '../utils.js'
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
  return {
    name: 'vike:pluginViteRPC',
    configureServer(viteDevServer) {
      createViteRPC(viteDevServer, getViteRpcFunctions)
    },
    transform(code, id) {
      if (id !== runtimeFileWithDynamicImport) return
      const envName = this.environment?.name
      if (!envName || ['client', 'ssr'].includes(envName)) return
      // TODO/now use magic-string
      return code.replaceAll('__VIKE__DYNAMIC_IMPORT', 'import')
    },
  }
}
