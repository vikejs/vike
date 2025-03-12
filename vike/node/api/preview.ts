export { preview }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { preview as previewVite, type ResolvedConfig, type PreviewServer } from 'vite'
import type { APIOptions } from './types.js'

/**
 * Programmatically trigger `$ vike preview`
 *
 * https://vike.dev/api#preview
 */
async function preview(options: APIOptions = {}): Promise<{ viteServer: PreviewServer; viteConfig: ResolvedConfig }> {
  const { viteConfigEnhanced } = await prepareViteApiCall(options, 'preview')
  const server = await previewVite(viteConfigEnhanced)
  return {
    viteServer: server,
    viteConfig: server.config
  }
}
