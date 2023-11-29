export { assertFileRuntime }

import { Plugin } from 'vite'
import { assertUsage } from '../utils.js'

function assertFileRuntime(): Plugin {
  return {
    name: 'vike:assert-file-environment',
    enforce: 'pre',
    async transform(code, id, options) {
      if (!id.match(/\.[cm]?[jt]sx?$/)) return

      const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g
      let match
      while ((match = importRegex.exec(code)) !== null) {
        const importPath = match[1]

        if (options?.ssr && importPath?.includes('.client')) {
          assertUsage(
            false,
            `Import Error: Client-only module "${importPath}" included in server bundle (imported by "${id}").`
          )
        }
        if (!options?.ssr && importPath?.includes('.server')) {
          assertUsage(
            false,
            `Import Error: Server-only module "${importPath}" included in client bundle (imported by "${id}").`
          )
        }
      }
    }
  }
}
