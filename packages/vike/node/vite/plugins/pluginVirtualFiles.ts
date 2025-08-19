export { pluginVirtualFiles }

import type { Plugin, ResolvedConfig, HmrContext, ViteDevServer, ModuleNode, ModuleGraph } from 'vite'
import { normalizePath } from 'vite'
import { getVirtualFilePageConfigLazy } from './pluginVirtualFiles/getVirtualFilePageConfigLazy.js'
import { getVirtualFileEntry } from './pluginVirtualFiles/getVirtualFileEntry.js'
import {
  assert,
  assertPosixPath,
  isScriptFile,
  addVirtualFileIdPrefix,
  isVirtualFileId,
  removeVirtualFileIdPrefix,
} from '../utils.js'
import { parseVirtualFileId } from '../../shared/virtualFiles/parseVirtualFileId.js'
import { reloadVikeConfig, isV1Design, getVikeConfigInternalOptional } from '../shared/resolveVikeConfigInternal.js'
import pc from '@brillout/picocolors'
import { logConfigInfo } from '../shared/loggerNotProd.js'
import { getModuleFilePathAbsolute } from '../shared/getFilePath.js'
import { updateUserFiles } from '../../runtime/globalContext.js'
import { isPlusFile } from '../shared/resolveVikeConfigInternal/crawlPlusFiles.js'
import { isTemporaryBuildFile } from '../shared/resolveVikeConfigInternal/transpileAndExecuteFile.js'
import { getVikeConfigError } from '../../shared/getVikeConfigError.js'

function pluginVirtualFiles(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'vike:pluginVirtualFiles',
    async configResolved(config_) {
      config = config_
      // TO-DO/next-major-release: remove
      if (!isV1Design()) config.experimental.importGlobRestoreExtension = true
    },
    resolveId(id) {
      if (isVirtualFileId(id)) {
        return addVirtualFileIdPrefix(id)
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
      id = removeVirtualFileIdPrefix(id)
      const isDev = config._isDev
      assert(typeof isDev === 'boolean')

      const idParsed = parseVirtualFileId(id)
      if (idParsed) {
        if (idParsed.type === 'page') {
          const code = await getVirtualFilePageConfigLazy(id, isDev, config)
          return code
        }
        if (idParsed.type === 'global') {
          const code = await getVirtualFileEntry(id, options, config, isDev)
          return code
        }
      }
    },
    configureServer(server) {
      handleFileAddRemove(server, config)
    },
  }
}

function handleFileAddRemove(server: ViteDevServer, config: ResolvedConfig) {
  server.watcher.prependListener('add', (f) => listener(f, false))
  server.watcher.prependListener('unlink', (f) => listener(f, true))
  return
  async function listener(file: string, isRemove: boolean) {
    file = normalizePath(file)
    if (isTemporaryBuildFile(file)) return
    const { moduleGraph } = server
    const isVikeConfigDep = await isVikeConfigDependency(file, moduleGraph)
    const reload = () => reloadConfig(file, config, isRemove ? 'removed' : 'created', server)

    // Config code
    if (isVikeConfigDep && !isVikeConfigDep.isProcessedByVite) {
      reload()
      return
    }

    // New or deleted + file
    if (isPlusFile(file)) {
      reload()
      return
    }

    // Runtime code => let Vite handle it
    if (isVikeConfigDep && isVikeConfigDep.isProcessedByVite) {
      assert(existsInViteModuleGraph(file, moduleGraph))
      return
    }

    // Trick: when importing a file that doesn't exist => we don't know whether `file` is that missing file => we take a leap of faith when the conditions below are met.
    // - Not sure how reliable that trick is.
    // - Reloading Vike's config is cheap and file creation/removal is rare => the trick is worth it.
    // - Reproduction:
    //   ```bash
    //   rm someDep.js && sleep 2 && git checkout someDep.js
    //   ```
    if (isScriptFile(file) && getVikeConfigError() && !existsInViteModuleGraph(file, moduleGraph)) {
      reload()
      return
    }
  }
}

function invalidateVikeVirtualFiles(server: ViteDevServer) {
  const vikeVirtualFiles = getVikeVirtualFiles(server)
  vikeVirtualFiles.forEach((mod) => {
    server.moduleGraph.invalidateModule(mod)
  })
}

// Vite calls its hook handleHotUpdate() whenever *any file* is modified — including files that aren't in Vite's module graph such as `pages/+config.js`
async function handleHotUpdate(ctx: HmrContext, config: ResolvedConfig) {
  const { file, server } = ctx
  const isVikeConfigDep = await isVikeConfigDependency(ctx.file, ctx.server.moduleGraph)

  if (isVikeConfigDep) {
    if (!isVikeConfigDep.isProcessedByVite) {
      /* Tailwind breaks this assertion, see https://github.com/vikejs/vike/discussions/1330#discussioncomment-7787238
      const isViteModule = ctx.modules.length > 0
      assert(!isViteModule)
      */

      reloadConfig(file, config, 'modified', server)

      // Files such as `pages/+config.js` can potentially modify Vike's virtual files.
      // Triggers a full page reload
      const vikeVirtualFiles = getVikeVirtualFiles(server)
      return vikeVirtualFiles
    } else {
      // Ensure we invalidate `file` *before* server.ssrLoadModule() in updateUserFiles()
      // Vite already invalidates it, but *after* handleHotUpdate() and thus after server.ssrLoadModule()
      ctx.modules.forEach((mod) => server.moduleGraph.invalidateModule(mod))
      updateUserFiles()
    }
  }
}

async function isVikeConfigDependency(
  filePathAbsoluteFilesystem: string,
  moduleGraph: ModuleGraph,
): Promise<null | { isProcessedByVite: boolean }> {
  // Non-runtime Vike config files such as `pages/+config.js` which aren't processed by Vite.
  // - They're missing in Vite's module graph.
  // - Potentially modifies Vike's virtual files.
  // - Same for all `pages/+config.js` dependencies.
  assertPosixPath(filePathAbsoluteFilesystem)
  const vikeConfigObject = await getVikeConfigInternalOptional()
  if (vikeConfigObject) {
    const { _vikeConfigDependencies: vikeConfigDependencies } = vikeConfigObject
    vikeConfigDependencies.forEach((f) => assertPosixPath(f))
    if (vikeConfigDependencies.has(filePathAbsoluteFilesystem)) return { isProcessedByVite: false }
  }

  // Runtime Vike config files such as +data.js which are processed by Vite.
  // - They're included in Vite's module graph.
  // - They never modify Vike's virtual files.
  // - Same for all `+data.js` dependencies.
  const importers = getImporters(filePathAbsoluteFilesystem, moduleGraph)
  const isPlusValueFileDependency = Array.from(importers).some((importer) => importer.file && isPlusFile(importer.file))
  if (isPlusValueFileDependency) return { isProcessedByVite: true }

  return null
}

function reloadConfig(
  filePath: string,
  config: ResolvedConfig,
  op: 'modified' | 'created' | 'removed',
  server: ViteDevServer,
) {
  // Ensure server.ssrLoadModule() loads fresh Vike virtual files (`reloadConfig()` > `updateUserFiles()` > `server.ssrLoadModule()`)
  invalidateVikeVirtualFiles(server)

  {
    const filePathToShowToUserResolved = getModuleFilePathAbsolute(filePath, config)
    const msg = `${op} ${pc.dim(filePathToShowToUserResolved)}`
    logConfigInfo(msg, 'info')
  }

  reloadVikeConfig()

  updateUserFiles()
}

function getVikeVirtualFiles(server: ViteDevServer): ModuleNode[] {
  const vikeVirtualFiles = Array.from(server.moduleGraph.urlToModuleMap.keys())
    .filter((url) => parseVirtualFileId(url))
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

function existsInViteModuleGraph(file: string, moduleGraph: ModuleGraph): boolean {
  return !!moduleGraph.getModulesByFile(file)
}
