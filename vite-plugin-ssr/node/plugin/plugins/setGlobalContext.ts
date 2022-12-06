export { setGlobalContext }

import type { Plugin } from 'vite'
import { setGlobalContextViteDevServer, setGlobalContextViteConfig } from '../../globalContext'

function setGlobalContext(): Plugin {
  return {
    name: 'vite-plugin-ssr:setGlobalContext',
    configureServer(viteDevServer) {
      setGlobalContextViteDevServer(viteDevServer)
    },
    async configResolved(config) {
      setGlobalContextViteConfig(config)
    }
  } as Plugin
}
