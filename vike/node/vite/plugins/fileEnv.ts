export { fileEnv }

// Implementation for https://vike.dev/file-env
// Alternative implementations:
// - Remix: https://github.com/remix-run/remix/blob/0e542779499b13ab9291cf20cd5e6b43e2905151/packages/remix-dev/vite/plugin.ts#L1504-L1594
// - SvelteKit: https://github.com/sveltejs/kit/blob/6ea7abbc2f66e46cb83ff95cd459a5f548cb7e1e/packages/kit/src/exports/vite/index.js#L383-L401

import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import {
  assert,
  assertUsage,
  assertWarning,
  capitalizeFirstLetter,
  joinEnglish,
  rollupSourceMapRemove
} from '../utils.js'
import { extractAssetsRE } from './extractAssetsPlugin.js'
import { extractExportNamesRE } from './extractExportNamesPlugin.js'
import pc from '@brillout/picocolors'
import { getModuleFilePathAbsolute } from '../shared/getFilePath.js'
import { getExportNames } from '../shared/parseEsModule.js'
import { normalizeId } from '../shared/normalizeId.js'
import { isV1Design } from '../shared/resolveVikeConfig.js'

function fileEnv(): Plugin {
  let config: ResolvedConfig
  let viteDevServer: ViteDevServer | undefined
  return {
    name: 'vike:fileEnv',
    load(id, options) {
      // In build, we use generateBundle() instead of the load() hook. Using load() works for dynamic imports in dev thanks to Vite's lazy transpiling, but it doesn't work in build because Rollup transpiles any dynamically imported module even if it's never actually imported.
      if (!viteDevServer) return
      if (!isV1Design()) return
      if (skip(id)) return
      // For `.vue` files: https://github.com/vikejs/vike/issues/1912#issuecomment-2394981475
      if (id.endsWith('?direct')) id = id.slice(0, -1 * '?direct'.length)
      const moduleInfo = viteDevServer.moduleGraph.getModuleById(id)
      assert(moduleInfo)
      const importers: string[] = Array.from(moduleInfo.importers)
        .map((m) => m.id)
        .filter((id) => id !== null)
      assertFileEnv(
        id,
        !!options?.ssr,
        importers,
        // In dev, we only show a warning because we don't want to disrupt when the user plays with settings such as [ssr](https://vike.dev/ssr).
        true
      )
    },
    // In production, we have to use transform() to replace modules with a runtime error because generateBundle() doesn't work for dynamic imports. In production, dynamic imports can only be verified at runtime.
    async transform(code, id, options) {
      id = normalizeId(id)
      // In dev, only using load() is enough as it also works for dynamic imports (see sibling comment).
      if (viteDevServer) return
      if (skip(id)) return
      const isServerSide = !!options?.ssr
      if (!isWrongEnv(id, isServerSide)) return
      const { importers } = this.getModuleInfo(id)!
      // Throwing a verbose error doesn't waste client-side KBs as dynamic imports are code splitted.
      const errMsg = getErrorMessage(id, isServerSide, importers, false, true)
      // We have to inject empty exports to avoid Rollup complaining about missing exports, see https://gist.github.com/brillout/5ea45776e65bd65100a52ecd7bfda3ff
      const { exportNames } = await getExportNames(code)
      return rollupSourceMapRemove(
        [
          `throw new Error(${JSON.stringify(errMsg)});`,
          ...exportNames.map((name) =>
            name === 'default' ? 'export default undefined;' : `export const ${name} = undefined;`
          )
        ].join('\n')
      )
    },
    generateBundle() {
      Array.from(this.getModuleIds())
        .filter((id) => !skip(id))
        .forEach((moduleId) => {
          const mod = this.getModuleInfo(moduleId)!
          const { importers } = mod
          if (importers.length === 0) {
            // Dynamic imports can only be verified at runtime
            /* This assertion can fail: https://github.com/vikejs/vike/issues/2227
            assert(dynamicImporters.length > 0)
            */
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
    const modulePath = getModulePath(moduleId)

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
    const modulePath = getModulePath(moduleId)
    const suffixWrong = getSuffix(isServerSide ? 'client' : 'server')
    return modulePath.includes(suffixWrong)
  }

  function skip(id: string): boolean {
    // TODO/v1-release: remove
    if (extractAssetsRE.test(id) || extractExportNamesRE.test(id)) return true
    if (!id.includes(getSuffix('client')) && !id.includes(getSuffix('server'))) return true
    if (getModulePath(id).endsWith('.css')) return true
    // Apply `.server.js` and `.client.js` only to user files
    if (id.includes('/node_modules/')) return true
    // Only user files
    if (!id.startsWith(config.root)) return true
    return false
  }

  function getSuffix(env: 'client' | 'server') {
    return `.${env}.` as const
  }

  function getModulePath(moduleId: string) {
    return moduleId.split('?')[0]!
  }
}
