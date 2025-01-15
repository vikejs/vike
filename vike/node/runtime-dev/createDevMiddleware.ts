export { createDevMiddleware }

import { createServer } from 'vite'
import { prepareApiCall } from '../api/prepareApiCall.js'
import type { ResolvedConfig, Connect, ViteDevServer } from 'vite'
import type { APIOptions } from '../api/types.js'

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
      middlewareMode: options.viteConfig?.server?.middlewareMode ?? true
    }
  }
  if (options.root) viteConfig.root = options.root
  const { viteConfigEnhanced } = await prepareApiCall(viteConfig, 'dev')
  const server = await createServer(viteConfigEnhanced)
  const devMiddleware = server.middlewares
  return { devMiddleware, viteServer: server, viteConfig: server.config }
}
