export { createDevMiddleware }

import path from 'node:path'
import { createServer, normalizePath } from 'vite'
import { prepareViteApiCall } from './api/prepareViteApiCall.js'
import type { ResolvedConfig, Connect, ViteDevServer } from 'vite'
import type { ApiOptions } from './api/types.js'
import { getServerEntryViteServer } from './api/serverEntryDev.js'
import { assertWarning } from '../utils/assert.js'
import { joinEnglish } from '../utils/joinEnglish.js'
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
    warnIgnoredOptions(options, viteServer)
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

function warnIgnoredOptions(options: { root?: string } & ApiOptions, viteServer: ViteDevServer): void {
  const optionsIgnored = [
    options.viteConfig && 'viteConfig',
    options.vikeConfig && 'vikeConfig',
    options.root && normalizePath(path.resolve(options.root)) !== viteServer.config.root && 'root',
  ].filter((o) => typeof o === 'string')
  if (optionsIgnored.length === 0) return
  const isPlural = optionsIgnored.length > 1
  assertWarning(
    false,
    `The ${pc.cyan('createDevMiddleware()')} option${isPlural ? 's' : ''} ${joinEnglish(optionsIgnored, 'and', { color: pc.cyan })} ${isPlural ? 'are' : 'is'} ignored: ${pc.cyan('$ vike dev')} created Vite's development server before running +serverEntry.js — you can use vite.config.js or +config.js instead`,
    { onlyOnce: true },
  )
}
