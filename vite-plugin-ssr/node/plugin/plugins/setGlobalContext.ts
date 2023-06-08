export { setGlobalContext }

import type { Plugin } from 'vite'
import {
  setGlobalContext_viteDevServer,
  setGlobalContext_vitePreviewServer,
  setGlobalContext_viteConfig
} from '../../runtime/globalContext'

function setGlobalContext(): Plugin {
  return {
    name: 'vite-plugin-ssr:setGlobalContext',
    configureServer(viteDevServer) {
      setGlobalContext_viteDevServer(viteDevServer)
    },
    configurePreviewServer(vitePreviewServer) {
      setGlobalContext_vitePreviewServer(vitePreviewServer)
    },
    async configResolved(config) {
      setGlobalContext_viteConfig(config)
    }
  }
}
