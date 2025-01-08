export { preview }

import { resolveConfig } from './resolveConfig.js'
import { isVikeCli } from './isVikeCli.js'
import { preview as previewVite } from 'vite'

async function preview() {
  // Adds vike to viteConfig if not present
  const { viteConfig } = await resolveConfig({}, 'preview')
  if (!isVikeCli) return previewVite(viteConfig)

    const server = await previewVite(viteConfig)
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
    return server
}
