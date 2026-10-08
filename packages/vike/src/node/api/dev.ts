export { dev }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { createServer, type ResolvedConfig, type ViteDevServer } from 'vite'
import type { ApiOptions, ApiOptionsStartupLog } from './types.js'
import { assert } from '../../utils/assert.js'
import { assertIsNotProductionRuntime } from '../../utils/assertSetup.js'
import './assertEnvApiDev.js'
import { startupLog } from './startupLog.js'
import {
  getServerEntryDevCli,
  isServerEntryProcess,
  startServerEntry_child,
  startServerEntry_parent,
} from './devServerEntry.js'
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
  const serverEntryFilePath = await getServerEntryDevCli()
  if (serverEntryFilePath && !isServerEntryProcess()) return await startServerEntry_parent()
  // +serverEntry.js creates the server: it uses Vite's development server as middleware
  const server = await createServer(
    serverEntryFilePath
      ? { ...viteConfigUser, server: { ...viteConfigUser.server, middlewareMode: true } }
      : viteConfigUser,
  )
  const viteServer = server
  const viteConfig = server.config
  const viteVersion = viteConfig._viteVersionResolved
  assert(viteVersion)
  if (viteServer.httpServer) await viteServer.listen()
  if (options.startupLog) startupLog(viteConfig, viteServer)
  if (serverEntryFilePath) await startServerEntry_child(viteServer, serverEntryFilePath)
  return {
    viteServer,
    viteConfig,
    viteVersion,
  }
}
