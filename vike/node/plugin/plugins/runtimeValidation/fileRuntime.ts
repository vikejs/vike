export { assertFileRuntime }

import { Plugin } from 'vite'
import { assertUsage } from '../../utils.js'

function assertFileRuntime(): Plugin {
  return {
    name: 'vike:assert-file-runtime',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      const resolved = await this.resolve(source, importer, { skipSelf: true, ...options })
      if (!resolved) return

      const additionalMessage = importer ? ` (imported by ${importer.split('?')[0]}) ` : ''
      const modulePath = resolved.id.split('?')[0] || ''
      if (options?.ssr && modulePath.includes('.client')) {
        // assertUsage(false, `Client-only module "${modulePath}" included in server bundle${additionalMessage}.`)
        assertUsage(false, `Client-only module included in server bundle.`)
      }
      if (!options?.ssr && modulePath.includes('.server')) {
        // assertUsage(false, `Server-only module "${modulePath}" included in client bundle${additionalMessage}.`)
        assertUsage(false, `Server-only module included in client bundle.`)
      }
    }
  }
}
