export { dev }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { createServer, type ResolvedConfig, type ViteDevServer } from 'vite'
import type { ApiOptions, ApiOptionsStartupLog } from './types.js'
import { assert } from '../../utils/assert.js'
import { assertIsNotProductionRuntime } from '../../utils/assertSetup.js'
import './assertEnvApiDev.js'
import { getStartupLogFirstLine } from './getStartupLogFirstLine.js'
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
  if (options.startupLog) startupLog(viteServer)
  return {
    viteServer,
    viteConfig,
    viteVersion,
  }
}

function startupLog(viteServer: ViteDevServer) {
  const { startupLogFirstLine, isStartupLogCompact } = getStartupLogFirstLine(viteServer.config)
  console.log(startupLogFirstLine)
  // Vite throws an error if `resolvedUrls` is missing:
  // https://github.com/vitejs/vite/blob/df5a30d2690a2ebc4824a79becdcef30538dc602/packages/vite/src/node/server/index.ts#L745
  if (viteServer.resolvedUrls) viteServer.printUrls()
  viteServer.bindCLIShortcuts({ print: true })
  if (!isStartupLogCompact) console.log()
}
