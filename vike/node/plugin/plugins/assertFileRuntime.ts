export { assertFileRuntime }

import { Plugin } from 'vite'
import { assert, assertUsage } from '../utils.js'
import { extractAssetsRE } from './extractAssetsPlugin.js'
import { extractExportNamesRE } from './extractExportNamesPlugin.js'

function assertFileRuntime(): Plugin {
  return {
    name: 'vike:assertFileRuntime',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      // TODO/v1-release: remove
      if (extractAssetsRE.test(source) || extractExportNamesRE.test(source)) return

      // Seems like Vite is doing some funky stuff here.
      if (importer?.endsWith('.html')) {
        return
      }

      // I don't know why and who sets importer to '<stdin>' (I guess Vite?).
      if (importer === '<stdin>') {
        importer = undefined
      }

      const resolved = await this.resolve(source, importer, options)
      // Is there a situation where resolved is null?
      assert(resolved)
      const modulePath = resolved.id.split('?')[0]!

      // TODO/v1-release: remove
      if (modulePath.endsWith('.css')) return

      const additionalMessage = importer ? ` (imported by ${importer.split('?')[0]})` : ''
      if (options?.ssr && modulePath.includes('.client.')) {
        assertUsage(false, `Client-only module "${modulePath}" included in server bundle${additionalMessage}.`)
      }
      if (!options?.ssr && modulePath.includes('.server.')) {
        assertUsage(false, `Server-only module "${modulePath}" included in client bundle${additionalMessage}.`)
      }
    }
  }
}
