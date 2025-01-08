export { preview }

import { enhanceViteConfig } from './enhanceViteConfig.js'
import { preview as previewVite } from 'vite'

async function preview() {
  const { viteConfigEnhanced } = await enhanceViteConfig({}, 'preview')
  const server = await previewVite(viteConfigEnhanced)
  return server
}
