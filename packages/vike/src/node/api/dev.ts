export { dev }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { createServer, type InlineConfig, type ResolvedConfig, type ViteDevServer } from 'vite'
import type { ApiOptions, ApiOptionsStartupLog } from './types.js'
import { assert } from '../../utils/assert.js'
import { assertIsNotProductionRuntime } from '../../utils/assertSetup.js'
import './assertEnvApiDev.js'
import { startupLog } from './startupLog.js'
import {
  startServerEntry_parent,
  startServerEntry_child,
  getServerEntryFilePath_ifDevCli,
  isServerChildProcess,
} from './serverEntryDev.js'
import { setGlobalContext_isServerEntryDev } from '../../server/runtime/globalContext.js'
assertIsNotProductionRuntime()

/**
 * Programmatically trigger `$ vike dev`
 *
 * https://vike.dev/api#dev
 */
async function dev(
  options: ApiOptions & ApiOptionsStartupLog = {},
): Promise<{ viteServer: ViteDevServer; viteConfig: ResolvedConfig; viteVersion: string }> {
  const { viteConfigUser } = await prepareViteApiCall(options, 'dev')

  // `$ vike dev` runs +serverEntry.js if there isn't +server.js — https://vike.dev/serverEntry
  const serverEntryFilePath = await getServerEntryFilePath_ifDevCli()
  const serverEntryIsChildProcess = isServerChildProcess()
  if (serverEntryFilePath && !serverEntryIsChildProcess) return await startServerEntry_parent()
  // globalContext.devMiddleware is only for +serverEntry.js
  // - Otherwise Vite's development server already runs its middlewares before Vike
  if (serverEntryFilePath) setGlobalContext_isServerEntryDev()

  const server = await createServer(
    serverEntryFilePath
      ? // +serverEntry.js creates the server: it uses Vite's development server as middleware
        setMiddlewareMode(viteConfigUser)
      : viteConfigUser,
  )

  const viteServer = server
  const viteConfig = server.config
  const viteVersion = viteConfig._viteVersionResolved
  assert(viteVersion)

  if (viteServer.httpServer) await viteServer.listen()

  if (options.startupLog) startupLog(viteConfig, viteServer)

  if (serverEntryFilePath && serverEntryIsChildProcess) await startServerEntry_child(viteServer, serverEntryFilePath)

  return {
    viteServer,
    viteConfig,
    viteVersion,
  }
}

function setMiddlewareMode(viteConfig: InlineConfig): InlineConfig {
  return { ...viteConfig, server: { ...viteConfig.server, middlewareMode: true } }
}
