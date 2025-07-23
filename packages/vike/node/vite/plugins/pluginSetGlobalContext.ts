export { pluginSetGlobalContext }

import type { Plugin, ViteDevServer } from 'vite'
import {
  setGlobalContext_viteDevServer,
  setGlobalContext_viteConfig,
  setGlobalContext_isProduction,
} from '../../runtime/globalContext.js'
import {
  createViteRPC,
  isDevCheck,
  markSetup_isViteDev,
  markSetup_viteDevServer,
  markSetup_vitePreviewServer,
} from '../utils.js'
import { reloadVikeConfig } from '../shared/resolveVikeConfigInternal.js'
import { getViteConfigRuntime } from '../shared/getViteConfigRuntime.js'

export type ViteRpcFunctions = ReturnType<typeof getRpcFunctions>
function getRpcFunctions(viteDevServer: ViteDevServer) {
  return {
    async transformIndexHtml(html: string) {
      return await viteDevServer.transformIndexHtml('/', html)
    },
  }
}

function pluginSetGlobalContext(): Plugin[] {
  let isServerReload = false
  return [
    {
      name: 'vike:pluginSetGlobalContext:pre',
      enforce: 'pre',
      // This hook is called not only at server start but also at server restart (a new `viteDevServer` instance is created)
      configureServer: {
        order: 'pre',
        handler(viteDevServer) {
          createViteRPC(viteDevServer, getRpcFunctions)
          if (isServerReload) reloadVikeConfig()
          isServerReload = true
          setGlobalContext_viteDevServer(viteDevServer)
          markSetup_viteDevServer()
        },
      },
      configurePreviewServer() {
        markSetup_vitePreviewServer()
      },
      config: {
        order: 'pre',
        handler(_, env) {
          const isViteDev = isDevCheck(env)
          setGlobalContext_isProduction(!isViteDev)
          markSetup_isViteDev(isViteDev)
        },
      },
    },
    {
      name: 'vike:pluginSetGlobalContext:post',
      enforce: 'post',
      configResolved: {
        order: 'post',
        async handler(config) {
          const viteConfigRuntime = getViteConfigRuntime(config)
          setGlobalContext_viteConfig(config, viteConfigRuntime)
        },
      },
    },
  ]
}
