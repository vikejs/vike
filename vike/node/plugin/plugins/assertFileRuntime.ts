export { assertFileRuntime }

import { Plugin } from 'vite'
import { assert, assertUsage } from '../utils.js'
import { extractAssetsRE } from './extractAssetsPlugin.js'
import { extractExportNamesRE } from './extractExportNamesPlugin.js'

function assertFileRuntime(): Plugin {
  return {
    name: 'vike:assertFileRuntime',
    // - We need to set `enforce: 'pre'` because, otherwise, the resolvedId() hook of Vite's internal plugin `vite:resolve` is called before and it doesn't seem to call this.resolvedId() which means that the resolveId() hook below is never called.
    //   - Vite's `vite:resolve` plugin: https://github.com/vitejs/vite/blob/d649daba7682791178b711d9a3e44a6b5d00990c/packages/vite/src/node/plugins/resolve.ts#L105
    // - It's actually a good thing if the resolveId() hook below is the first one to be called because it doesn't actually resolve any ID, so all other resolveId() will be called as normal. And with this.resolvedId() we get the information we want from all other resolvedId() hooks.
    // - Path aliases are already resolved even when using `enforce: 'pre'`. For example:
    //   ```js
    //   // The value of `source` is /home/rom/code/vike/examples/path-aliases/components/Counter
    //   // The value of `importer` is /home/rom/code/vike/examples/path-aliases/pages/index/+Page.tsx
    //
    //   // /pages/index/+Page.tsx
    //
    //   import { Counter } from '#root/components/Counter'
    //   ```
    enforce: 'pre',
    resolveId: {
      order: 'pre',
      // @ts-expect-error already true by default
      sequential: true,
      async handler(source, importer, options) {
        // TODO/v1-release: remove
        if (extractAssetsRE.test(source) || extractExportNamesRE.test(source)) return

        // Seems like Vite is doing some funky stuff here.
        if (importer?.endsWith('.html')) {
          return
        }

        if (
          // Don't show Vike's virtual modules that import plus files such as /pages/about/+Page.js
          importer?.includes('virtual:vike:') ||
          // I don't know why and who sets importer to '<stdin>' (I guess Vite?).
          importer === '<stdin>'
        ) {
          importer = undefined
        }

        const resolved = await this.resolve(source, importer, {
          // Rollup says that skipSelf is true by default but that doesn't seem to be the case
          skipSelf: true,
          ...options
        })
        // Is there a situation where resolved is null?
        assert(resolved)
        const modulePath = resolved.id.split('?')[0]!

        // `.server.js` and `.client.js` should only apply to user files
        if (modulePath.includes('/node_modules/')) return
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
}
