export { retrieveDevServer }

import type { Plugin } from 'vite'
import { setViteDevServer } from '../../globalContext'

function retrieveDevServer(): Plugin {
  return {
    name: 'vite-plugin-ssr:retrieveDevServer',
    configureServer(viteDevServer) {
      setViteDevServer(viteDevServer)
    },
  } as Plugin
}
