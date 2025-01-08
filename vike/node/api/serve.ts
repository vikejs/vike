export { serve }

import { resolveConfig } from './resolveConfig.js'
import { createServer } from 'vite'

async function serve() {
  const { viteConfig } = await resolveConfig({}, 'serve')
  const server = await createServer(viteConfig)
  return server
}
