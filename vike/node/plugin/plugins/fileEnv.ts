export { fileEnv }

// Implementation for https://vike.dev/file-env
// Alternative implementations:
// - Remix: https://github.com/remix-run/remix/blob/0e542779499b13ab9291cf20cd5e6b43e2905151/packages/remix-dev/vite/plugin.ts#L1504-L1594
// - SvelteKit: https://github.com/sveltejs/kit/blob/6ea7abbc2f66e46cb83ff95cd459a5f548cb7e1e/packages/kit/src/exports/vite/index.js#L383-L401

import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { assert, assertUsage, assertWarning, capitalizeFirstLetter, joinEnglish } from '../utils.js'
import { extractAssetsRE } from './extractAssetsPlugin.js'
import { extractExportNamesRE } from './extractExportNamesPlugin.js'
import pc from '@brillout/picocolors'
import { getModuleFilePathAbsolute } from '../shared/getFilePath.js'
import { sourceMapRemove } from '../shared/rollupSourceMap.js'
import { getExportNames } from '../shared/parseEsModule.js'

function fileEnv(): Plugin {
  let config: ResolvedConfig
  let viteDevServer: ViteDevServer | undefined
  return {
    name: 'vike:fileEnv',
    load(id, options) {
      // In build, we use generateBundle() instead of the load() hook. Using load() works for dynamic imports in dev thanks to Vite's lazy transpiling, but it doesn't work in build since dynamically imported modules are transpiled even if they are never loaded.
      if (!viteDevServer) return
      if (isIgnored(id)) return
      const moduleInfo = viteDevServer.moduleGraph.getModuleById(id)
      assert(moduleInfo)
      const importers: string[] = Array.from(moduleInfo.importers)
        .map((m) => m.id)
        .filter((id) => id !== null)
      assertFileEnv(id, !!options?.ssr, importers, true)
    },
    // We use transform() to replace modules with a runtime error, because dynamic imports can only be checked at runtime.
    async transform(code, id, options) {
      // In dev, the warning in load() is enough.
      if (viteDevServer) return
      if (isIgnored(id)) return
      const isServerSide = !!options?.ssr
      if (!isWrongEnv(id, isServerSide)) return
      const { importers } = this.getModuleInfo(id)!
      // Throwing a verbose error doesn't waste client-side KBs as dynamic imports are code splitted.
      const errMsg = getErrorMessage(id, isServerSide, importers, false, true)
      // We have to inject empty exports to avoid Rollup complaing about missing exports, see https://gist.github.com/brillout/5ea45776e65bd65100a52ecd7bfda3ff
      const { exportNames } = await getExportNames(code)
      return sourceMapRemove(
        [
          `throw new Error(${JSON.stringify(errMsg)})`,
          ...exportNames.map((name) =>
            name === 'default' ? 'export default undefined;' : `export const ${name} = undefined;`
          )
        ].join('\n')
      )
    },
    generateBundle() {
      Array.from(this.getModuleIds())
        .filter((id) => !isIgnored(id))
        .forEach((moduleId) => {
          const { importers, dynamicImporters } = this.getModuleInfo(moduleId)!
          if (importers.length === 0) {
            // Dynamic imports can only be checked at runtime
            assert(dynamicImporters.length > 0)
            return
          }
          assertFileEnv(moduleId, !!config.build.ssr, importers, false)
        })
    },
    configResolved(config_) {
      config = config_
    },
    configureServer(viteDevServer_) {
      viteDevServer = viteDevServer_
    }
  }

  function assertFileEnv(
    moduleId: string,
    isServerSide: boolean,
    importers: string[] | readonly string[],
    onlyWarn: boolean
  ) {
    if (!isWrongEnv(moduleId, isServerSide)) return
    const errMsg = getErrorMessage(moduleId, isServerSide, importers, onlyWarn, false)
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
    onlyWarn: boolean,
    noColor: boolean
  ) {
    const modulePath = moduleId.split('?')[0]!

    const envActual = isServerSide ? 'server' : 'client'
    const envExpect = isServerSide ? 'client' : 'server'

    let errMsg: string
    let modulePathPretty = getModuleFilePathAbsolute(modulePath, config)
    if (!noColor) {
      const suffix = getSuffix(envExpect)
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

  function isWrongEnv(moduleId: string, isServerSide: boolean): boolean {
    const modulePath = moduleId.split('?')[0]!
    const suffixWrong = getSuffix(isServerSide ? 'client' : 'server')
    return modulePath.includes(suffixWrong)
  }

  function isIgnored(id: string): boolean {
    // TODO/v1-release: remove
    if (extractAssetsRE.test(id) || extractExportNamesRE.test(id)) return true
    if (!id.includes(getSuffix('client')) && !id.includes(getSuffix('server'))) return true
    if (id.split('?')[0]!.endsWith('.css')) return true
    // Apply `.server.js` and `.client.js` only to user files
    if (id.includes('/node_modules/')) return true
    // Only user files
    if (!id.startsWith(config.root)) return true
    return false
  }

  function getSuffix(env: 'client' | 'server') {
    return `.${env}.` as const
  }
}
