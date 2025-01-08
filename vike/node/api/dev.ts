export { dev }

import { enhanceViteConfig } from './enhanceViteConfig.js'
import { createServer } from 'vite'

async function dev() {
  const { viteConfigEnhanced } = await enhanceViteConfig({}, 'dev')
  const server = await createServer(viteConfigEnhanced)
  return server
}
