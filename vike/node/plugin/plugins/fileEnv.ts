export { fileEnv }

// Implementation for https://vike.dev/file-env

import type { Plugin, ResolvedConfig } from 'vite'
import { assert, assertUsage, assertWarning, capitalizeFirstLetter } from '../utils.js'
import { extractAssetsRE } from './extractAssetsPlugin.js'
import { extractExportNamesRE } from './extractExportNamesPlugin.js'
import pc from '@brillout/picocolors'
import { getModuleFilePathAbsolute } from '../shared/getFilePath.js'

function fileEnv(): Plugin {
  let config: ResolvedConfig
  let isDev = false
  return {
    name: 'vike:fileEnv',
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
        // It seems like Vite's scan doesn't apply transformers. (We need the `.telefunc.js` transformer to apply for our analysis to be correct.)
        // @ts-expect-error Vite's type is wrong
        if (options.scan) return
        if ((options as any).isDynamicImport !== false) return

        // TODO/v1-release: remove
        if (extractAssetsRE.test(source) || extractExportNamesRE.test(source)) return

        // Seems like Vite is doing some funky stuff here.
        if (importer?.endsWith('.html')) return

        const resolved = await this.resolve(source, importer, {
          // Needed for old Vite plugins: https://vitejs.dev/guide/migration#rollup-4:~:text=For%20Vite%20plugins%2C%20this.resolve%20skipSelf%20option%20is%20now%20true%20by%20default.
          skipSelf: true,
          ...options
        })
        // resolved is null when import path is erroneous and doesn't actually point to a file
        if (!resolved) return
        const moduleId = resolved.id
        const modulePath = moduleId.split('?')[0]!

        // `.server.js` and `.client.js` should only apply to user files
        if (modulePath.includes('/node_modules/')) return

        // TODO/v1-release: remove
        // - I don't remember exactly, but I think I've added `TODO/v1-release: remove` because I vaguely remember that we can remove this after we remove the 0.4 design.
        if (modulePath.endsWith('.css')) return

        const isServerSide = options?.ssr
        const envActual = isServerSide ? 'server' : 'client'
        const envExpect = isServerSide ? 'client' : 'server'
        const suffix = `.${envExpect}.` as const

        // Everything is good
        if (!modulePath.includes(suffix)) return

        // Show error message
        let errMsg: string
        let modulePathPretty = getModuleFilePathAbsolute(moduleId, config)
        modulePathPretty = modulePathPretty.replaceAll(suffix, pc.bold(suffix))
        errMsg = `${capitalizeFirstLetter(
          envExpect
        )}-only file ${modulePathPretty} (https://vike.dev/file-env) imported on the ${envActual}-side`

        if (
          importer &&
          // Don't show Vike's virtual modules that import the entry plus files such as /pages/about/+Page.js
          !importer.includes('virtual:vike:') &&
          // I don't know why and who sets importer to '<stdin>' (I guess Vite?)
          importer !== '<stdin>'
        ) {
          const importerPath = getModuleFilePathAbsolute(importer, config)
          errMsg += ` by ${importerPath}`
        }

        if (isDev) {
          errMsg += ' and, therefore, Vike will prevent building your app for production.'
          assertWarning(false, errMsg, { onlyOnce: true })
        } else {
          assertUsage(false, errMsg)
        }
      }
    },
    configResolved(config_) {
      config = config_
    },
    configureServer() {
      isDev = true
    },
    // Ensure this plugin works
    transform(_code, id, options): void {
      if (isDev) return
      // TODO/v1-release: remove
      if (extractAssetsRE.test(id) || extractExportNamesRE.test(id)) return
      if (id.split('?')[0]!.endsWith('.css')) return

      const isServerSide = options?.ssr
      const envWrong = isServerSide ? 'client' : 'server'
      assert(!id.includes(`.${envWrong}.`))
    }
  }
}
