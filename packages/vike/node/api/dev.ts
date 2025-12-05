export { dev }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { createServer, type ResolvedConfig, type ViteDevServer, version as viteVersionVike } from 'vite'
import type { ApiOptions } from './types.js'
import { viteVersion as viteVersionUser } from '../vite/plugins/pluginCommon.js'

/**
 * Programmatically trigger `$ vike dev`
 *
 * https://vike.dev/api#dev
 */
async function dev(
  options: ApiOptions = {},
): Promise<{ viteServer: ViteDevServer; viteConfig: ResolvedConfig; viteVersion: string }> {
  const { viteConfigFromUserResolved } = await prepareViteApiCall(options, 'dev')
  const server = await createServer(viteConfigFromUserResolved)
  const viteVersion = viteVersionUser ?? viteVersionVike
  return {
    viteServer: server,
    viteConfig: server.config,
    viteVersion,
  }
}
