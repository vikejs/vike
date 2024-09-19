export { fileEnv }

// Implementation for https://vike.dev/file-env

import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { assert, assertUsage, assertWarning, capitalizeFirstLetter, joinEnglish } from '../utils.js'
import { extractAssetsRE } from './extractAssetsPlugin.js'
import { extractExportNamesRE } from './extractExportNamesPlugin.js'
import pc from '@brillout/picocolors'
import { getModuleFilePathAbsolute } from '../shared/getFilePath.js'
import { sourceMapRemove } from '../shared/rollupSourceMap.js'

function fileEnv(): Plugin {
  let config: ResolvedConfig
  let isDev = false
  let viteDevServer: ViteDevServer | undefined
  return {
    name: 'vike:fileEnv',
    load(id, options) {
      // - In build, we don't use load() and instead of showing a warning we throw an error in generateBundle()
      // - load() also works for dynamic import() in dev (but not in build) thanks to Vite's lazy transpiling
      if (!viteDevServer) return
      if (isIgnored(id)) return
      const moduleInfo = viteDevServer.moduleGraph.getModuleById(id)
      const importers: string[] = Array.from(moduleInfo!.importers)
        .map((m) => m.id)
        .filter((id) => id !== null)
      assertFileEnv(id, !!options?.ssr, importers, true)
    },
    // Dynamic imports can only be checked at runtime
    transform(_code, id, options) {
      // The warning in load() is enough
      if (isDev) return
      const isServerSide = !!options?.ssr
      if (!isWrongEnv(id, isServerSide)) return
      const { importers } = this.getModuleInfo(id)!
      const errMsg = getErrorMessage(id, isServerSide, importers, false, true)
      return sourceMapRemove(`throw new Error(${JSON.stringify(errMsg)})`)
    },
    generateBundle() {
      const moduleIdsAll = this.getModuleIds()
      const moduleIdsUser = Array.from(moduleIdsAll).filter((id) => !isIgnored(id))
      moduleIdsUser.forEach((moduleId) => {
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
      isDev = true
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
    // Only user files
    if (!id.startsWith(config.root)) return true
    return false
  }
}
