export { viteErrorCleanup }
export { viteAlreadyLoggedError }

import { getViteDevServer } from './globalContext'
import { hasProp } from './utils'

function viteErrorCleanup(err: unknown) {
  const viteDevServer = getViteDevServer()
  if (!viteDevServer) {
    return
  }
  if (hasProp(err, 'stack')) {
    // Apply source maps
    viteDevServer.ssrFixStacktrace(err as Error)
  }
}

function viteAlreadyLoggedError(err: unknown): boolean {
  const viteDevServer = getViteDevServer()
  if (!viteDevServer) {
    return false
  }
  return viteDevServer.config.logger.hasErrorLogged(err as Error)
}
