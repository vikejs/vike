export { createDevMiddleware }

import { createServer } from 'vite'
import { prepareViteApiCall } from '../api/prepareViteApiCall.js'
import type { ResolvedConfig, Connect, ViteDevServer } from 'vite'
import type { APIOptions } from '../api/types.js'
import { setGlobalContext_isProduction } from '../runtime/globalContextServerSide.js'

/*
 * Create server middleware for development with HMR and lazy-transpiling.
 *
 * https://vike.dev/createDevMiddleware
 */
async function createDevMiddleware(
  options: { root?: string } & APIOptions = {}
): Promise<{ devMiddleware: Connect.Server; viteServer: ViteDevServer; viteConfig: ResolvedConfig }> {
  setGlobalContext_isProduction(false, true)
  const optionsMod = {
    ...options,
    viteConfig: {
      ...options.viteConfig,
      root: options.root ?? options.viteConfig?.root,
      server: {
        ...options.viteConfig?.server,
        middlewareMode: options.viteConfig?.server?.middlewareMode ?? true
      }
    }
  }
  const { viteConfigFromUserEnhanced } = await prepareViteApiCall(optionsMod, 'dev')
  const server = await createServer(viteConfigFromUserEnhanced)
  const devMiddleware = server.middlewares
  return { devMiddleware, viteServer: server, viteConfig: server.config }
}
