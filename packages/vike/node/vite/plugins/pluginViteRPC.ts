export { pluginViteRPC }

import type { Plugin, ViteDevServer } from 'vite'
import { createViteRPC, assertIsNotProductionRuntime } from '../utils.js'
assertIsNotProductionRuntime()

export type ViteRpc = ReturnType<typeof getRpcFunctions>
function getRpcFunctions(viteDevServer: ViteDevServer) {
  return {
    async transformIndexHtml(html: string) {
      return await viteDevServer.transformIndexHtml('/', html)
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
