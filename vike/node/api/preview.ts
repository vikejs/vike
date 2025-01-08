export { preview }

import { resolveConfig } from './resolveConfig.js'
import { preview as previewVite } from 'vite'

async function preview() {
  const { viteConfig } = await resolveConfig({}, 'preview')
  const server = await previewVite(viteConfig)
  return server
}
