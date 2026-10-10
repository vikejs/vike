export { createDevMiddleware }

import { createServer } from 'vite'
import { prepareViteApiCall } from './api/prepareViteApiCall.js'
import type { ResolvedConfig, Connect, ViteDevServer } from 'vite'
import type { ApiOptions } from './api/types.js'
import { getViteDevServer } from '../server/runtime/globalContext.js'
import { assertWarning } from '../utils/assert.js'
import pc from '@brillout/picocolors'

/*
 * Create server middleware for development with HMR and lazy-transpiling.
 *
 * https://vike.dev/createDevMiddleware
 */
async function createDevMiddleware(
  options: { root?: string } & ApiOptions = {},
): Promise<{ devMiddleware: Connect.Server; viteServer: ViteDevServer; viteConfig: ResolvedConfig }> {
  {
    const viteServer = getViteDevServer()
    if (viteServer) {
      assertWarning(
        false,
        // E.g. `$ vike dev` already created it (+serverEntry.js, +server.js), or createDevMiddleware() was already called
        `The development middleware already created: use ${pc.cyan('globalContext.devMiddleware')} to access it instead of calling ${pc.cyan('createDevMiddleware()')}`,
        { onlyOnce: true },
      )
      return { devMiddleware: viteServer.middlewares, viteServer, viteConfig: viteServer.config }
    }
  }

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
  const { viteConfigUser } = await prepareViteApiCall(optionsMod, 'dev')
  const server = await createServer(viteConfigUser)
  const devMiddleware = server.middlewares
  return { devMiddleware, viteServer: server, viteConfig: server.config }
}
