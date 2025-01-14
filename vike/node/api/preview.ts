export { preview }

import { prepareApiCall } from './prepareApiCall.js'
import { preview as previewVite } from 'vite'
import type { APIOptions } from './types.js'

async function preview(options: APIOptions = {}) {
  const { viteConfigEnhanced } = await prepareApiCall(options.viteConfig, 'preview')
  const server = await previewVite(viteConfigEnhanced)
  return server
}
