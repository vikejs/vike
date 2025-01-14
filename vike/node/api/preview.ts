export { preview }

import { prepareApiCall } from './prepareApiCall.js'
import { preview as previewVite, type ResolvedConfig, type PreviewServer } from 'vite'
import type { APIOptions } from './types.js'

async function preview(options: APIOptions = {}): Promise<{ viteServer: PreviewServer; viteConfig: ResolvedConfig }> {
  const { viteConfigEnhanced } = await prepareApiCall(options.viteConfig, 'preview')
  const server = await previewVite(viteConfigEnhanced)
  return {
    viteServer: server,
    viteConfig: server.config
  }
}
