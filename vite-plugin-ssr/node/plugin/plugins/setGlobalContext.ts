export { setGlobalContext }

import type { Plugin } from 'vite'
import {
  setGlobalContext_viteDevServer,
  setGlobalContext_vitePreviewServer,
  setGlobalContext_viteConfig
} from '../../runtime/globalContext.js'

function setGlobalContext(): Plugin {
  return {
    name: 'vite-plugin-ssr:setGlobalContext',
    enforce: 'pre',
    configureServer: {
      order: 'pre',
      handler(viteDevServer) {
        setGlobalContext_viteDevServer(viteDevServer)
      }
    },
    configurePreviewServer: {
      order: 'pre',
      handler(vitePreviewServer) {
        setGlobalContext_vitePreviewServer(vitePreviewServer)
      }
    },
    configResolved: {
      order: 'pre',
      handler(config) {
        setGlobalContext_viteConfig(config)
      }
    }
  }
}
