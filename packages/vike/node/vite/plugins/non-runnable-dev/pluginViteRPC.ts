export { pluginViteRPC }

import type { Plugin, ViteDevServer } from 'vite'
import { createViteRPC, isDevCheck } from '../../utils.js'
import type { ClientDependency } from '../../../../shared/getPageFiles/analyzePageClientSide/ClientDependency.js'
import { retrievePageAssetsDev } from '../../../../server/runtime/renderPageServer/getPageAssets/retrievePageAssetsDev.js'
import { getViteConfigRuntime } from '../../shared/getViteConfigRuntime.js'

/* We cannot use [`filter.id`](https://rolldown.rs/plugins/hook-filters) because Vite's optimizeDeps bundles the package `vike` into node_modules/.vite/deps_ssr/chunk-WBC5FHD7.js
const distFileIsNonRunnableDev = requireResolveDistFile('dist/esm/utils/isNonRunnableDev.js')
const distFileGlobalContext = requireResolveDistFile('dist/esm/server/runtime/globalContext.js')
const filterRolldown = {
  id: {
    include: [distFileIsNonRunnableDev, distFileGlobalContext].map(
      (filePath) => new RegExp(`^${escapeRegex(filePath)}($|${escapeRegex('?')}.*)`),
    ),
  },
}
*/

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
