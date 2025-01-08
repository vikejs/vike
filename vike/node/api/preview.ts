export { preview }

import { enhanceViteConfig } from './enhanceViteConfig.js'
import { preview as previewVite } from 'vite'

async function preview() {
  const { viteConfig } = await enhanceViteConfig({}, 'preview')
  const server = await previewVite(viteConfig)
  return server
}
