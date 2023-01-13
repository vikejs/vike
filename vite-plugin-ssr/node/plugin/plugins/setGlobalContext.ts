export { setGlobalContext }
export type { ViteDevServerEnhanced }

import type { Plugin, ViteDevServer } from 'vite'
import { setGlobalContextViteDevServer, setGlobalContextViteConfig } from '../../runtime/globalContext'
import { logRollupError, isRollupError } from '../helpers'
import { objectAssign } from '../utils'

// We don't let the VPS runtime import logRollupError() directly. Instead, we make the VPS runtime use viteDevServer.logRollupError(). To avoid unnecessarily loading the code of logRollupError() in production.
type ViteDevServerEnhanced = ViteDevServer & {
  logRollupError: typeof logRollupError
  isRollupError: typeof isRollupError
}

function setGlobalContext(): Plugin {
  return {
    name: 'vite-plugin-ssr:setGlobalContext',
    configureServer(viteDevServer) {
      objectAssign(viteDevServer, { logRollupError, isRollupError })
      const ViteDevServerEnhanced: ViteDevServerEnhanced = viteDevServer
      setGlobalContextViteDevServer(ViteDevServerEnhanced)
    },
    async configResolved(config) {
      setGlobalContextViteConfig(config)
    }
  } as Plugin
}
