export { preview }

import { resolveConfig } from './resolveConfig.js'
import { isVikeCli } from './isVikeCli.js'
import { preview as previewVite } from 'vite'
import pc from '@brillout/picocolors'

async function preview() {
  // Adds vike to viteConfig if not present
  const { viteConfig, viteConfigResolved: resolvedConfig } = await resolveConfig({}, 'preview')
  if (!isVikeCli) return previewVite(viteConfig)

  try {
    const server = await previewVite(viteConfig)
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
    return server
  } catch (e: any) {
    resolvedConfig.logger.error(pc.red(`error when starting preview server:\n${e.stack}`), {
      error: e
    })
    process.exit(1)
  }
}
