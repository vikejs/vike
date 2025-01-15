export { createDevMiddleware }

import { prepareApiCall } from './prepareApiCall.js'
import { createServer, type ResolvedConfig, type Connect, type ViteDevServer } from 'vite'
import type { APIOptions } from './types.js'

/*
 * Create server middleware for development with HMR and lazy-transpiling.
 *
 * https://vike.dev/createDevMiddleware
 */
async function createDevMiddleware(
  options: { root?: string } & APIOptions = {}
): Promise<{ devMiddleware: Connect.Server; viteServer: ViteDevServer; viteConfig: ResolvedConfig }> {
  const viteConfig = {
    ...options.viteConfig,
    server: {
      ...options.viteConfig?.server,
      middlewareMode: true
    }
  }
  if (options.root) viteConfig.root = options.root
  const { viteConfigEnhanced } = await prepareApiCall(viteConfig, 'dev')
  const server = await createServer(viteConfigEnhanced)
  const devMiddleware = server.middlewares
  return { devMiddleware, viteServer: server, viteConfig: server.config }
}
