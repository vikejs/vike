export { setGlobalContext }

import type { Plugin } from 'vite'
import { setGlobalContext_viteDevServer } from '../../runtime/globalContext.js'

function setGlobalContext(): Plugin {
  return {
    name: 'vike:setGlobalContext',
    enforce: 'pre',
    configureServer: {
      order: 'pre',
      handler(viteDevServer) {
        setGlobalContext_viteDevServer(viteDevServer)
      }
    }
  }
}
