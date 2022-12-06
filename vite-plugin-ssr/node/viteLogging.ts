export { viteErrorCleanup }
export { viteAlreadyLoggedError }

import { getGlobalContext } from './globalContext'
import { hasProp } from './utils'

function viteErrorCleanup(err: unknown) {
  const { viteDevServer } = getGlobalContext()
  if (!viteDevServer) {
    return
  }
  if (hasProp(err, 'stack')) {
    // Apply source maps
    viteDevServer.ssrFixStacktrace(err as Error)
  }
}

function viteAlreadyLoggedError(err: unknown): boolean {
  const { viteDevServer } = getGlobalContext()
  if (!viteDevServer) {
    return false
  }
  return viteDevServer.config.logger.hasErrorLogged(err as Error)
}
