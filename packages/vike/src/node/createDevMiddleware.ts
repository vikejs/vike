export { createDevMiddleware }

import { createServer } from 'vite'
import { prepareViteApiCall } from './api/prepareViteApiCall.js'
import type { ResolvedConfig, Connect, ViteDevServer } from 'vite'
import type { ApiOptions } from './api/types.js'
import { getServerEntryViteServer } from './api/serverEntryDev.js'
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
  assertWarning(
    !getServerEntryViteServer(),
    `${pc.cyan('createDevMiddleware()')} in +serverEntry.js creates a second Vite development server, so HMR won't work: ${pc.cyan('$ vike dev')} already created one, use ${pc.cyan('globalContext.devMiddleware')} instead`,
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
