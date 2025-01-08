export { dev }

import { resolveConfig } from './resolveConfig.js'
import { createServer } from 'vite'

async function dev() {
  const { viteConfig } = await resolveConfig({}, 'dev')
  const server = await createServer(viteConfig)
  return server
}
