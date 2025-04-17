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
import { reloadVikeConfig, isV1Design, getVikeConfig, getVikeConfigOptional } from './v1-design/getVikeConfig.js'
import pc from '@brillout/picocolors'
import { logConfigInfo } from '../../shared/loggerNotProd.js'
import { getModuleFilePathAbsolute } from '../../shared/getFilePath.js'
import { updateUserFiles } from '../../../runtime/globalContextServerSide.js'
import { isPlusFile } from './v1-design/getVikeConfig/crawlPlusFiles.js'

function importUserCode(): Plugin {
  let config: ResolvedConfig
  let vikeConfig: VikeConfigObject
  return {
    name: 'vike:importUserCode',
    async configResolved(config_) {
      vikeConfig = await getVikeConfig(config_)
      config = config_
      // TODO/v1-release: remove
      if (!isV1Design(config)) config.experimental.importGlobRestoreExtension = true
    },
    resolveId(id) {
      if (isVirtualFileId(id)) {
        return resolveVirtualFileId(id)
      }
    },
    async handleHotUpdate(ctx) {
      try {
        return await handleHotUpdate(ctx, config)
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
  async function listener(file: string, isRemove: boolean) {
    file = normalizePath(file)
    if (isPlusFile(file) || (await isVikeConfigDependency(file, server.moduleGraph))?.modifiesVikeVirtualFiles) {
      invalidateVikeVirtualFiles(server)
      reloadConfig(file, config, isRemove ? 'removed' : 'created')
    }
  }
}

function invalidateVikeVirtualFiles(server: ViteDevServer) {
  const vikeVirtualFiles = getVikeVirtualFiles(server)
  vikeVirtualFiles.forEach((mod) => {
    server.moduleGraph.invalidateModule(mod)
  })
}

async function handleHotUpdate(ctx: HmrContext, config: ResolvedConfig) {
  const { file, server } = ctx
  const isVikeConfig = await isVikeConfigDependency(ctx.file, ctx.server.moduleGraph)

  if (isVikeConfig) {
    if (isVikeConfig.modifiesVikeVirtualFiles) {
      /* Tailwind breaks this assertion, see https://github.com/vikejs/vike/discussions/1330#discussioncomment-7787238
      const isViteModule = ctx.modules.length > 0
      assert(!isViteModule)
      */

      // Ensure server.ssrLoadModule() loads fresh Vike virtual files (`reloadConfig()` > `updateUserFiles()` > `server.ssrLoadModule()`)
      invalidateVikeVirtualFiles(server)
      reloadConfig(file, config, 'modified')

      // Triggers a full page reload
      const vikeVirtualFiles = getVikeVirtualFiles(server)
      return vikeVirtualFiles
    } else {
      // Ensure we invalidate `file` *before* server.ssrLoadModule() in updateUserFiles()
      // Vite already invalidates it, but possibly *after* handleHotUpdate() and thus after server.ssrLoadModule()
      ctx.modules.forEach((mod) => server.moduleGraph.invalidateModule(mod))
      updateUserFiles()
    }
  }
}

async function isVikeConfigDependency(
  filePathAbsoluteFilesystem: string,
  moduleGraph: ModuleGraph
): Promise<null | { modifiesVikeVirtualFiles: boolean }> {
  // Check config-only files, for example all pages/+config.js dependencies. (There aren't part of Vite's module graph.)
  assertPosixPath(filePathAbsoluteFilesystem)
  const vikeConfigObject = await getVikeConfigOptional()
  if (vikeConfigObject) {
    const { vikeConfigDependencies } = vikeConfigObject
    vikeConfigDependencies.forEach((f) => assertPosixPath(f))
    if (vikeConfigDependencies.has(filePathAbsoluteFilesystem)) return { modifiesVikeVirtualFiles: true }
  }

  // Check using Vite's module graph, for example all +htmlAttributes dependencies.
  // Alternatively, simply call updateUserFiles() on every handleHotUpdate() call.
  const importers = getImporters(filePathAbsoluteFilesystem, moduleGraph)
  const isPlusValueFileDependency = Array.from(importers).some((importer) => importer.file && isPlusFile(importer.file))
  if (isPlusValueFileDependency) return { modifiesVikeVirtualFiles: false }

  return null
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

function getVikeVirtualFiles(server: ViteDevServer): ModuleNode[] {
  const vikeVirtualFiles = Array.from(server.moduleGraph.urlToModuleMap.keys())
    .filter((url) => isVirtualFileIdPageConfigValuesAll(url) || isVirtualFileIdImportUserCode(url))
    .map((url) => {
      const mod = server.moduleGraph.urlToModuleMap.get(url)
      assert(mod)
      return mod
    })
  return vikeVirtualFiles
}

// Get all transitive importers (including the module itself)
function getImporters(file: string, moduleGraph: ModuleGraph): Set<ModuleNode> {
  const importers = new Set<ModuleNode>()
  const mods = moduleGraph.getModulesByFile(file)
  if (!mods) return importers

  for (const mod of mods) {
    getModuleImporters(mod).forEach((importer) => {
      if (importer) importers.add(importer)
    })
  }

  return importers
}
function getModuleImporters(mod: ModuleNode, seen: Set<ModuleNode> = new Set()): Set<ModuleNode> {
  if (seen.has(mod)) return new Set()
  seen.add(mod)

  const importers = new Set<ModuleNode>()
  if (mod.id) importers.add(mod)

  // Traverse through the importers (modules that import this module)
  for (const importer of mod.importers) {
    if (importer.id) importers.add(importer)
    getModuleImporters(importer, seen).forEach((importerTransitive) => {
      if (importerTransitive) importers.add(importerTransitive)
    })
  }

  return importers
}
