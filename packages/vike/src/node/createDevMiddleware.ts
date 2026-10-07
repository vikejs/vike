export { createDevMiddleware }

import { createServer } from 'vite'
import { prepareViteApiCall } from './api/prepareViteApiCall.js'
import type { ResolvedConfig, Connect, ViteDevServer } from 'vite'
import type { ApiOptions } from './api/types.js'
import { getServerEntryViteServer } from './api/devServerEntry.js'
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
  // `$ vike dev` runs +serverEntry.js => it already created Vite's development server — https://vike.dev/serverEntry
  const viteServer = getServerEntryViteServer()
  if (viteServer) {
    assertWarning(
      !options.viteConfig,
      `${pc.cyan('createDevMiddleware({ viteConfig })')} is ignored when ${pc.cyan('$ vike dev')} runs +serverEntry.js — set your Vite config in vite.config.js instead`,
      { onlyOnce: true },
    )
    return { devMiddleware: viteServer.middlewares, viteServer, viteConfig: viteServer.config }
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
