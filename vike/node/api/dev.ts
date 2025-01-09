export { dev }

import { enhanceViteConfig } from './enhanceViteConfig.js'
import { createServer } from 'vite'
import type { APIOptions } from './APIOptions.js'

async function dev(options: APIOptions = {}) {
  const { viteConfigEnhanced } = await enhanceViteConfig(options.viteConfig, 'dev')
  const server = await createServer(viteConfigEnhanced)
  return server
}
