export { createDevMiddleware }

import { createServer } from 'vite'
import { prepareViteApiCall } from './api/prepareViteApiCall.js'
import type { ResolvedConfig, Connect, ViteDevServer } from 'vite'
import type { ApiOptions } from './api/types.js'

/*
 * Create server middleware for development with HMR and lazy-transpiling.
 *
 * https://vike.dev/createDevMiddleware
 */
async function createDevMiddleware(
  options: { root?: string } & ApiOptions = {},
): Promise<{ devMiddleware: Connect.Server; viteServer: ViteDevServer; viteConfig: ResolvedConfig }> {
  console.log('createDevMiddleware()')
  const optionsMod = {
    ...options,
    viteConfig: {
      ...options.viteConfig,
      root: options.root ?? options.viteConfig?.root,
      server: {
        ...options.viteConfig?.server,
        middlewareMode: options.viteConfig?.server?.middlewareMode ?? true,
      },
    },
  }
  const { viteConfigFromUserResolved } = await prepareViteApiCall(optionsMod, 'dev')
  const server = await createServer(viteConfigFromUserResolved)
  const devMiddleware = server.middlewares
  return { devMiddleware, viteServer: server, viteConfig: server.config }
}
