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
  // E.g. `$ vike dev` already created it (+serverEntry.js, +server.js), or createDevMiddleware() was already called
  assertWarning(
    !getViteDevServer(),
    `Use ${pc.cyan('globalContext.devMiddleware')} instead of running ${pc.cyan('createDevMiddleware()')} as it creates a second Vite development server: Vite's development server was already created`,
    { onlyOnce: true },
  )

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
