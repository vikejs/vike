export { dev }

import { enhanceViteConfig } from './enhanceViteConfig.js'
import { createServer } from 'vite'

async function dev() {
  const { viteConfig } = await enhanceViteConfig({}, 'dev')
  const server = await createServer(viteConfig)
  return server
}
