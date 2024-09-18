export { fileEnv }

// Implementation for https://vike.dev/file-env

import type { Plugin, ResolvedConfig } from 'vite'
import { assert, assertUsage, assertWarning, capitalizeFirstLetter, joinEnglish } from '../utils.js'
import { extractAssetsRE } from './extractAssetsPlugin.js'
import { extractExportNamesRE } from './extractExportNamesPlugin.js'
import pc from '@brillout/picocolors'
import { getModuleFilePathAbsolute } from '../shared/getFilePath.js'
import { sourceMapRemove } from '../shared/rollupSourceMap.js'

function fileEnv(): Plugin {
  let config: ResolvedConfig
  let isDev = false
  const moduleGraphLazy: Record<string, string[]> = {}
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
        if (isIgnored(source)) return
        if (
          !importer ||
          // Don't show Vike's virtual modules that import the entry plus files such as /pages/about/+Page.js
          importer.includes('virtual:vike:') ||
          // Seems like Vite is doing some funky stuff here.
          importer.endsWith('.html') ||
          // I don't know why and who sets importer to '<stdin>' (I guess Vite?)
          importer === '<stdin>'
        ) {
          return
        }
        const resolved = await this.resolve(source, importer, {
          // Needed for old Vite plugins: https://vitejs.dev/guide/migration#rollup-4:~:text=For%20Vite%20plugins%2C%20this.resolve%20skipSelf%20option%20is%20now%20true%20by%20default.
          skipSelf: true,
          ...options
        })
        // resolved is null when import path is erroneous and doesn't actually point to a file
        if (!resolved) return
        const moduleId = resolved.id
        if (isIgnored(moduleId)) return

        moduleGraphLazy[moduleId] ??= []
        const importerPath = getModuleFilePathAbsolute(importer, config)
        moduleGraphLazy[moduleId]!.push(importerPath)
      }
    },
    load(id, options) {
      // - In build, instead of showing a warning we throw an error in generateBundle()
      // - load() also works for dynamic import() in dev (but not in build) thanks to Vite's lazy transpiling
      if (!isDev) return
      const importers = moduleGraphLazy[id] ?? []
      assertFileEnv(id, !!options?.ssr, importers, true, config)
    },
    configResolved(config_) {
      config = config_
    },
    configureServer() {
      isDev = true
    },
    // Dynamic imports can only be checked at runtime
    transform(_code, id, options) {
      // The warning in load() is enough
      if (isDev) return
      const isServerSide = !!options?.ssr
      if (!isWrongEnv(id, isServerSide)) return
      const importers = moduleGraphLazy[id] ?? []
      const errMsg = getErrorMessage(id, isServerSide, importers, config, false, true)
      return sourceMapRemove(`throw new Error(${JSON.stringify(errMsg)})`)
    },
    generateBundle() {
      const moduleIdsAll = this.getModuleIds()
      const moduleIdsUser = Array.from(moduleIdsAll).filter(
        (id) =>
          // Apply `.server.js` and `.client.js` only to user files
          !id.includes('/node_modules/') &&
          // Only user files
          id.startsWith(config.root) &&
          isIgnored(id)
      )
      moduleIdsUser.forEach((moduleId) => {
        const moduleInfo = this.getModuleInfo(moduleId)!
        const { importers, dynamicImporters } = moduleInfo
        if (importers.length === 0) {
          // Dynamic imports can only be checked at runtime
          assert(dynamicImporters.length > 0)
          return
        }
        assertFileEnv(moduleId, !!config.build.ssr, importers, false, config)
      })
    }
  }
}

function assertFileEnv(
  moduleId: string,
  isServerSide: boolean,
  importers: string[] | readonly string[],
  onlyWarn: boolean,
  config: ResolvedConfig
) {
  if (!isWrongEnv(moduleId, isServerSide)) return
  const errMsg = getErrorMessage(moduleId, isServerSide, importers, config, onlyWarn, false)
  if (onlyWarn) {
    assertWarning(false, errMsg, { onlyOnce: true })
  } else {
    assertUsage(false, errMsg)
  }
}

function getErrorMessage(
  moduleId: string,
  isServerSide: boolean,
  importers: string[] | readonly string[],
  config: ResolvedConfig,
  onlyWarn: boolean,
  noColor: boolean
) {
  const modulePath = moduleId.split('?')[0]!

  const envActual = isServerSide ? 'server' : 'client'
  const envExpect = isServerSide ? 'client' : 'server'

  let errMsg: string
  let modulePathPretty = getModuleFilePathAbsolute(modulePath, config)
  if (!noColor) {
    const suffix = `.${envExpect}.` as const
    modulePathPretty = modulePathPretty.replaceAll(suffix, pc.bold(suffix))
  }
  errMsg = `${capitalizeFirstLetter(
    envExpect
  )}-only file ${modulePathPretty} (https://vike.dev/file-env) imported on the ${envActual}-side`

  if (importers.length > 0) {
    const importPaths = importers.map((importer) => getModuleFilePathAbsolute(importer, config))
    errMsg += ` by ${joinEnglish(importPaths, 'and')}`
  }

  if (onlyWarn) {
    errMsg += ' and, therefore, Vike will prevent building your app for production.'
  }

  return errMsg
}

function isWrongEnv(moduleId: string, isServerSide: boolean) {
  if (isIgnored(moduleId)) return
  const modulePath = moduleId.split('?')[0]!
  const envWrong = isServerSide ? 'client' : 'server'
  return modulePath.includes(`.${envWrong}.`)
}

function isIgnored(id: string): boolean {
  // TODO/v1-release: remove
  if (extractAssetsRE.test(id) || extractExportNamesRE.test(id)) return true
  if (id.split('?')[0]!.endsWith('.css')) return true
  // Apply `.server.js` and `.client.js` only to user files
  if (id.includes('/node_modules/')) return true
  return false
}
