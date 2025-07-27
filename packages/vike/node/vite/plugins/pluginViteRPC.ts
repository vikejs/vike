export { pluginViteRPC }

// TODO/now: rename file

import { isRunnableDevEnvironment, type RunnableDevEnvironment, type Plugin, type ViteDevServer } from 'vite'
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
  let viteDevServer: ViteDevServer
  return {
    name: 'vike:pluginViteRPC',
    configureServer(viteDevServer_) {
      viteDevServer = viteDevServer_
      createViteRPC(viteDevServer, getViteRpcFunctions)
    },
    transform(code, id) {
      if (id !== runtimeFileWithDynamicImport) return
      if (!this.environment) return
      if (isRunnableDevEnvironment(this.environment)) return
      if (!(this.environment as RunnableDevEnvironment).runner) return
      // TODO/now use magic-string
      const codeMod = code.replaceAll('__VIKE__DYNAMIC_IMPORT', 'import')
      return codeMod
    },
  }
}
