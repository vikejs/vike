export { dev }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { createServer, type ResolvedConfig, type ViteDevServer } from 'vite'
import type { APIOptions } from './types.js'

/**
 * Programmatically trigger `$ vike dev`
 *
 * https://vike.dev/api#dev
 */
async function dev(
  options: APIOptions = {}
): Promise<{ viteServer: ViteDevServer; viteConfig: ResolvedConfig; isMiddlewareMode: boolean }> {
  const { viteConfigFromUserEnhanced } = await prepareViteApiCall(options, 'dev')
  const server = await createServer(viteConfigFromUserEnhanced)
  return {
    viteServer: server,
    isMiddlewareMode: server.httpServer === null,
    viteConfig: server.config
  }
}
