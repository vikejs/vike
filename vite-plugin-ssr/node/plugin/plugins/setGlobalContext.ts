export { setGlobalContext }
export type { ViteDevServerEnhanced }

import type { Plugin, ViteDevServer } from 'vite'
import { setGlobalContextViteDevServer, setGlobalContextViteConfig } from '../../runtime/globalContext'
import { logTranspileError, isTranspileError } from '../helpers'
import { objectAssign } from '../utils'

// We don't let the VPS runtime import logTranspileError() directly. Instead, we make the VPS runtime use viteDevServer.logTranspileError(). To avoid unnecessarily loading the code of logTranspileError() in production.
type ViteDevServerEnhanced = ViteDevServer & {
  logTranspileError: typeof logTranspileError
  isTranspileError: typeof isTranspileError
}

function setGlobalContext(): Plugin {
  return {
    name: 'vite-plugin-ssr:setGlobalContext',
    configureServer(viteDevServer) {
      objectAssign(viteDevServer, { logTranspileError, isTranspileError })
      const ViteDevServerEnhanced: ViteDevServerEnhanced = viteDevServer
      setGlobalContextViteDevServer(ViteDevServerEnhanced)
    },
    async configResolved(config) {
      setGlobalContextViteConfig(config)
    }
  }
}
