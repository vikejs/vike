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
  const { viteConfigFromUserEnhanced } = await prepareViteApiCall(options, 'preview')
  const server = await previewVite(viteConfigFromUserEnhanced)
  return {
    viteServer: server,
    viteConfig: server.config
  }
}
