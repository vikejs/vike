export { dev }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { createServer, type ResolvedConfig, type ViteDevServer } from 'vite'
import type { ApiOptions, ApiOptionsStartupLog } from './types.js'
import { assert } from '../../utils/assert.js'
import { assertIsNotProductionRuntime } from '../../utils/assertSetup.js'
import './assertEnvApiDev.js'
import { startupLog } from './startupLog.js'
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
  const server = await createServer(viteConfigUser)
  const viteServer = server
  const viteConfig = server.config
  const viteVersion = viteConfig._viteVersionResolved
  assert(viteVersion)
  if (viteServer.httpServer) await viteServer.listen()
  if (options.startupLog) startupLog(viteConfig, viteServer)
  return {
    viteServer,
    viteConfig,
    viteVersion,
  }
}
