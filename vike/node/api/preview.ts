export { preview }

import { enhanceViteConfig } from './enhanceViteConfig.js'
import { preview as previewVite } from 'vite'
import type { APIOptions } from './APIOptions.js'

async function preview(options: APIOptions = {}) {
  const { viteConfigEnhanced } = await enhanceViteConfig(options.viteConfig, 'preview')
  const server = await previewVite(viteConfigEnhanced)
  return server
}
