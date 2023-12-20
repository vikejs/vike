export { assertFileEnv }

import type { Plugin, ResolvedConfig } from 'vite'
import {
  assert,
  assertUsage,
  assertWarning,
  capitalizeFirstLetter,
  getFilePathRelativeToUserRootDir
} from '../utils.js'
import { extractAssetsRE } from './extractAssetsPlugin.js'
import { extractExportNamesRE } from './extractExportNamesPlugin.js'
import pc from '@brillout/picocolors'

function assertFileEnv(): Plugin {
  let config: ResolvedConfig
  let isDev = false
  return {
    name: 'vike:assertFileEnv',
    // - We need to set `enforce: 'pre'` because, otherwise, the resolvedId() hook of Vite's internal plugin `vite:resolve` is called before and it doesn't seem to call `this.resolve()` which means that the resolveId() hook below is never called.
    //   - Vite's `vite:resolve` plugin: https://github.com/vitejs/vite/blob/d649daba7682791178b711d9a3e44a6b5d00990c/packages/vite/src/node/plugins/resolve.ts#L105
    // - It's actually a good thing if the resolveId() hook below is the first one to be called because it doesn't actually resolve any ID, so all other resolveId() hooks will be called as normal. And with `this.resolve()` we get the information we want from all other resolvedId() hooks.
    // - Path aliases are already resolved, even when using `enforce: 'pre'`. For example:
    //   ```js
    //   // /pages/index/+Page.tsx
    //
    //   // The value of `source` is `/home/rom/code/vike/examples/path-aliases/components/Counter` (instead of `#root/components/Counter`)
    //   // The value of `importer` is `/home/rom/code/vike/examples/path-aliases/pages/index/+Page.tsx`
    //   import { Counter } from '#root/components/Counter'
    //   ```
    enforce: 'pre',
    resolveId: {
      /* I don't know why, but path aliases aren't resolved anymore when setting `order: 'pre'`. (In principle, I'd assume that `this.resolve()` would resolve the alias but it doesn't.)
      order: 'pre',
      */
      async handler(source, importer, options) {
        // TODO/v1-release: remove
        if (extractAssetsRE.test(source) || extractExportNamesRE.test(source)) return

        // Seems like Vite is doing some funky stuff here.
        if (importer?.endsWith('.html')) {
          return
        }

        if (
          // Don't show Vike's virtual modules that import the entry plus files such as /pages/about/+Page.js
          importer?.includes('virtual:vike:') ||
          // I don't know why and who sets importer to '<stdin>' (I guess Vite?)
          importer === '<stdin>'
        ) {
          importer = undefined
        }

        const resolved = await this.resolve(source, importer, {
          // Rollup says that skipSelf is true by default but that doesn't seem to be the case
          skipSelf: true,
          ...options
        })
        // Is there a situation where `resolved` is null?
        assert(resolved)
        const modulePath = resolved.id.split('?')[0]!

        // `.server.js` and `.client.js` should only apply to user files
        if (modulePath.includes('/node_modules/')) return
        // TODO/v1-release: remove
        if (modulePath.endsWith('.css')) return

        const isServerSide = options?.ssr
        const envActual = isServerSide ? 'server' : 'client'
        const envExpect = isServerSide ? 'client' : 'server'
        const suffix = `.${envExpect}.` as const

        if (modulePath.includes(suffix)) {
          const modulePathPretty = modulePath.replaceAll(suffix, pc.bold(suffix))
          let msg = `${capitalizeFirstLetter(
            envExpect
          )}-only module "${modulePathPretty}" (https://vike.dev/file-env) imported on the ${envActual}-side`
          if (importer) {
            const importerPath = getFilePathRelativeToUserRootDir(importer.split('?')[0]!, config.root)
            msg += `by ${importerPath}`
          }
          if (isDev) {
            msg += ' (building your app for production will be prevented and an error will be thrown)'
            assertWarning(false, msg, { onlyOnce: true })
          } else {
            assertUsage(false, msg)
          }
        }
      }
    },
    configResolved(config_) {
      config = config_
    },
    configureServer() {
      isDev = true
    },
    // Ensure that this plugin works
    transform(_code, id, options) {
      const isServerSide = options?.ssr
      const envWrong = isServerSide ? 'client' : 'server'
      assert(!id.includes(`.${envWrong}.`))
    }
  }
}
