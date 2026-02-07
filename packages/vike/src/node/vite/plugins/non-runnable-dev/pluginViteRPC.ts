export { pluginViteRPC }

import type { Plugin, ViteDevServer } from 'vite'
import { createViteRPC } from '../../../../utils/getViteRPC.js'
import { isDevCheck } from '../../../../utils/isDev.js'
import type { ClientDependency } from '../../../../shared-server-client/getPageFiles/analyzePageClientSide/ClientDependency.js'
import { retrievePageAssetsDev } from '../../../../server/runtime/renderPageServer/getPageAssets/retrievePageAssetsDev.js'
import { getViteConfigRuntime } from '../../shared/getViteConfigRuntime.js'
import '../../assertEnvVite.js'

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

function pluginViteRPC(): Plugin[] {
  return [
    {
      name: 'vike:pluginViteRPC:1',
      apply: (_, configEnv) => isDevCheck(configEnv),
      configureServer: {
        handler(viteDevServer) {
          createViteRPC(viteDevServer, getViteRpcFunctions)
        },
      },
    },
  ]
}
