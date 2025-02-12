export { importUserCode }

import type { Plugin, ResolvedConfig, HmrContext, ViteDevServer, ModuleNode, ModuleGraph } from 'vite'
import { normalizePath } from 'vite'
import type { VikeConfigObject } from './v1-design/getVikeConfig.js'
import { getVirtualFilePageConfigValuesAll } from './v1-design/virtual-files/getVirtualFilePageConfigValuesAll.js'
import { getVirtualFileImportUserCode } from './getVirtualFileImportUserCode.js'
import { assert, assertPosixPath } from '../../utils.js'
import { resolveVirtualFileId, isVirtualFileId, getVirtualFileId } from '../../../shared/virtual-files.js'
import { isVirtualFileIdPageConfigValuesAll } from '../../../shared/virtual-files/virtualFilePageConfigValuesAll.js'
import { isVirtualFileIdImportUserCode } from '../../../shared/virtual-files/virtualFileImportUserCode.js'
import { vikeConfigDependencies, reloadVikeConfig, isV1Design, getVikeConfig } from './v1-design/getVikeConfig.js'
import pc from '@brillout/picocolors'
import { logConfigInfo } from '../../shared/loggerNotProd.js'
import { getModuleFilePathAbsolute } from '../../shared/getFilePath.js'
import { getPlusFileValueConfigName } from './v1-design/getVikeConfig/getPlusFilesAll.js'
import { updateUserFiles } from '../../../runtime/globalContext.js'

function importUserCode(): Plugin {
  let config: ResolvedConfig
  let vikeConfig: VikeConfigObject
  return {
    name: 'vike:importUserCode',
    async configResolved(config_) {
      vikeConfig = await getVikeConfig(config_)
      config = config_
      // TODO/v1-release: remove
      {
        const isV1 = await isV1Design(config)
        if (!isV1) config.experimental.importGlobRestoreExtension = true
      }
    },
    resolveId(id) {
      if (isVirtualFileId(id)) {
        return resolveVirtualFileId(id)
      }
    },
    handleHotUpdate(ctx) {
      try {
        return handleHotUpdate(ctx, config)
      } catch (err) {
        // Vite swallows errors thrown by handleHotUpdate()
        console.error(err)
        throw err
      }
    },
    async load(id, options) {
      if (!isVirtualFileId(id)) return undefined
      id = getVirtualFileId(id)
      const isDev = config._isDev
      assert(typeof isDev === 'boolean')

      if (isVirtualFileIdPageConfigValuesAll(id)) {
        const code = await getVirtualFilePageConfigValuesAll(id, isDev, config)
        return code
      }

      if (isVirtualFileIdImportUserCode(id)) {
        const code = await getVirtualFileImportUserCode(id, options, vikeConfig, config, isDev)
        return code
      }
    },
    configureServer(server) {
      handleFileAddRemove(server, config)
    }
  }
}

function handleFileAddRemove(server: ViteDevServer, config: ResolvedConfig) {
  server.watcher.prependListener('add', (f) => listener(f, false))
  server.watcher.prependListener('unlink', (f) => listener(f, true))
  return
  function listener(file: string, isRemove: boolean) {
    file = normalizePath(file)
    const isVikeConfig = isVikeConfigModule(file) || isVikeConfigFile(file)
    if (isVikeConfig) {
      const virtualModules = getVirtualModules(server)
      virtualModules.forEach((mod) => {
        server.moduleGraph.invalidateModule(mod)
      })
      reloadConfig(file, config, isRemove ? 'removed' : 'created')
    }
  }
}

function handleHotUpdate(ctx: HmrContext, config: ResolvedConfig) {
  const dependencies = getDependencies(ctx.file, ctx.server.moduleGraph)
  console.log('All dependencies (including the changed file):', Array.from(dependencies))

  const { file, server } = ctx
  const isVikeConfig = isVikeConfigModule(file)
  const isViteModule = ctx.modules.length > 0

  /* Should we show this?
  // - Can be useful for server files that aren't processed by Vite.
  // - Can be annoying for files that obviously aren't processed by Vite.
  if (!isVikeConfig && !isViteModule) {
    logViteAny(
      `${msg} — ${pc.cyan('no HMR')}, see https://vike.dev/on-demand-compiler`,
      'info',
      null,
      true
    )
    return
  }
  //*/

  // It can hide an error it shouldn't hide (because the error isn't shown again), but it's ok since users can reload the page and the error will be shown again (Vite transpilation errors are shown again upon a page reload).
  if (!isVikeConfig && isViteModule) {
    return
  }

  if (isVikeConfig) {
    /* Tailwind breaks this assertion, see https://github.com/vikejs/vike/discussions/1330#discussioncomment-7787238
    assert(!isViteModule)
    */
    reloadConfig(file, config, 'modified')
    const virtualModules = getVirtualModules(server)
    return virtualModules
  }
}

function isVikeConfigModule(filePathAbsoluteFilesystem: string): boolean {
  assertPosixPath(filePathAbsoluteFilesystem)
  vikeConfigDependencies.forEach((f) => assertPosixPath(f))
  return vikeConfigDependencies.has(filePathAbsoluteFilesystem)
}

function reloadConfig(filePath: string, config: ResolvedConfig, op: 'modified' | 'created' | 'removed') {
  {
    const filePathToShowToUserResolved = getModuleFilePathAbsolute(filePath, config)
    const msg = `${op} ${pc.dim(filePathToShowToUserResolved)}`
    logConfigInfo(msg, 'info')
  }
  reloadVikeConfig(config)
  updateUserFiles()
}

function getVirtualModules(server: ViteDevServer): ModuleNode[] {
  const virtualModules = Array.from(server.moduleGraph.urlToModuleMap.keys())
    .filter((url) => isVirtualFileIdPageConfigValuesAll(url) || isVirtualFileIdImportUserCode(url))
    .map((url) => {
      const mod = server.moduleGraph.urlToModuleMap.get(url)
      assert(mod)
      return mod
    })
  return virtualModules
}

function isVikeConfigFile(filePath: string): boolean {
  return !!getPlusFileValueConfigName(filePath)
}

function getDependencies(file: string, moduleGraph: ModuleGraph): Set<string> {
  const dependencies = new Set<string>()
  const mods = moduleGraph.getModulesByFile(file)
  if (!mods) return dependencies
  for (const mod of mods) {
    getModuleDependencies(mod).forEach((modDepId) => {
      if (modDepId) dependencies.add(modDepId)
    })
  }
  return dependencies
}
function getModuleDependencies(mod: ModuleNode, seen: Set<ModuleNode> = new Set()): Set<string> {
  if (seen.has(mod)) return new Set()
  seen.add(mod)

  const dependencies = new Set<string>()
  if (mod.id) dependencies.add(mod.id)

  // Recursion
  for (const modDep of mod.importedModules) {
    if (modDep.id) dependencies.add(modDep.id)
    getModuleDependencies(modDep, seen).forEach((modDepId) => {
      if (modDepId) dependencies.add(modDepId)
    })
  }

  return dependencies
}
