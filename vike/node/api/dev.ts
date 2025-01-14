export { dev }

import { prepareApiCall } from './prepareApiCall.js'
import { createServer, type ResolvedConfig, type ViteDevServer } from 'vite'
import type { APIOptions } from './types.js'

async function dev(options: APIOptions = {}): Promise<{ viteServer: ViteDevServer; viteConfig: ResolvedConfig }> {
  const { viteConfigEnhanced } = await prepareApiCall(options.viteConfig, 'dev')
  const server = await createServer(viteConfigEnhanced)
  return {
    viteServer: server,
    viteConfig: server.config
  }
}
