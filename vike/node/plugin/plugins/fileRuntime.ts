export { assertFileRuntime }

import { Plugin } from 'vite'
import { assertUsage } from '../utils.js'

function assertFileRuntime(): Plugin {
  return {
    name: 'vike:assert-file-runtime',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      const additionalMessage = importer ? ` (imported by ${importer.split('?')[0]}) ` : ''
      if (options?.ssr && source.includes('.client')) {
        assertUsage(false, `Client-only module "${source}" included in server bundle${additionalMessage}.`)
      }
      if (!options?.ssr && source.includes('.server')) {
        assertUsage(false, `Server-only module "${source}" included in client bundle${additionalMessage}.`)
      }
    }
  }
}
