export { createDevMiddleware }

import { createServer } from 'vite'
import { prepareViteApiCall } from '../api/prepareViteApiCall.js'
import type { ResolvedConfig, Connect, ViteDevServer } from 'vite'
import type { APIOptions } from '../api/types.js'
import { setGlobalContext_isProduction } from '../runtime/globalContext.js'

/*
 * Create server middleware for development with HMR and lazy-transpiling.
 *
 * https://vike.dev/createDevMiddleware
 */
async function createDevMiddleware(
  options: { root?: string } & APIOptions = {}
): Promise<{ devMiddleware: Connect.Server; viteServer: ViteDevServer; viteConfig: ResolvedConfig }> {
  setGlobalContext_isProduction(false)
  const viteConfigFromOptions = {
    ...options.viteConfig,
    server: {
      ...options.viteConfig?.server,
      middlewareMode: options.viteConfig?.server?.middlewareMode ?? true
    }
  }
  if (options.root) viteConfigFromOptions.root = options.root
  const { viteConfigEnhanced } = await prepareViteApiCall(viteConfigFromOptions, 'dev')
  const server = await createServer(viteConfigEnhanced)
  const devMiddleware = server.middlewares
  return { devMiddleware, viteServer: server, viteConfig: server.config }
}
