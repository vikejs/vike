export { pluginVirtualFiles }

import type { Plugin, ResolvedConfig, HmrContext, ViteDevServer, ModuleNode, ModuleGraph } from 'vite'
import { normalizePath } from 'vite'
import { generateVirtualFilePageEntry } from './pluginVirtualFiles/generateVirtualFilePageEntry.js'
import { generateVirtualFileGlobalEntryWithOldDesign } from './pluginVirtualFiles/generateVirtualFileGlobalEntryWithOldDesign.js'
import {
  assert,
  assertPosixPath,
  isScriptFile,
  addVirtualFileIdPrefix,
  isVirtualFileId,
  removeVirtualFileIdPrefix,
  escapeRegex,
  virtualFileIdPrefix1,
  virtualFileIdPrefix2,
} from '../utils.js'
import { parseVirtualFileId } from '../../../shared-server-node/virtualFileId.js'
import { reloadVikeConfig, isV1Design, getVikeConfigInternalOptional } from '../shared/resolveVikeConfigInternal.js'
import pc from '@brillout/picocolors'
import { logConfigInfo } from '../shared/loggerDev.js'
import { getFilePathToShowToUserModule } from '../shared/getFilePath.js'
import { updateUserFiles } from '../../../server/runtime/globalContext.js'
import { isPlusFile } from '../shared/resolveVikeConfigInternal/crawlPlusFiles.js'
import { isTemporaryBuildFile } from '../shared/resolveVikeConfigInternal/transpileAndExecuteFile.js'
import { debugFileChange, getVikeConfigError } from '../../../shared-server-node/getVikeConfigError.js'

const filterRolldown = {
  id: {
    include: new RegExp(`^(${escapeRegex(virtualFileIdPrefix1)}|${escapeRegex(virtualFileIdPrefix2)})`),
  },
}
const filterFunction = (id: string) => isVirtualFileId(id)

function pluginVirtualFiles(): Plugin[] {
  let config: ResolvedConfig
  return [
    {
      name: 'vike:pluginVirtualFiles',
      configResolved: {
        async handler(config_) {
          config = config_
          // TO-DO/next-major-release: remove
          if (!isV1Design()) config.experimental.importGlobRestoreExtension = true
        },
      },
      resolveId: {
        filter: filterRolldown,
        handler(id) {
          assert(filterFunction(id))
          return addVirtualFileIdPrefix(id)
        },
      },
      // Vite calls handleHotUpdate() whenever *any file* is modified — including files that aren't in Vite's module graph such as +config.js
      handleHotUpdate: {
        async handler(ctx) {
          debugFileChange('handleHotUpdate()', ctx.file)
          try {
            return await onFileModified(ctx, config)
          } catch (err) {
            // Vite swallows errors thrown by handleHotUpdate()
            console.error(err)
            throw err
          }
        },
      },
      load: {
        filter: filterRolldown,
        async handler(id, options) {
          assert(filterFunction(id))
          id = removeVirtualFileIdPrefix(id)
          const isDev = config._isDev
          assert(typeof isDev === 'boolean')

          const idParsed = parseVirtualFileId(id)
          if (idParsed) {
            if (idParsed.type === 'page-entry') {
              const code = await generateVirtualFilePageEntry(id, isDev)
              return code
            }
            if (idParsed.type === 'global-entry') {
              const code = await generateVirtualFileGlobalEntryWithOldDesign(
                id,
                options,
                config,
                this.environment,
                isDev,
              )
              return code
            }
          }
        },
      },
      configureServer: {
        handler(server) {
          server.watcher.prependListener('add', (file) => onFileCreatedOrRemoved(file, false, server, config))
          server.watcher.prependListener('unlink', (file) => onFileCreatedOrRemoved(file, true, server, config))
        },
      },
    },
  ]
}

async function onFileModified(ctx: HmrContext, config: ResolvedConfig) {
  const { file, server } = ctx
  const isAppFile = await isAppDependency(ctx.file, ctx.server.moduleGraph)
  debugFileChange(isAppFile)

  if (isAppFile) {
    if (isAppFile.isConfigDependency) {
      /* Tailwind breaks this assertion, see https://github.com/vikejs/vike/discussions/1330#discussioncomment-7787238
      const isViteModule = ctx.modules.length > 0
      assert(!isViteModule)
      */

      reloadConfig(file, config, 'modified', server)

      // Trigger a full page reload. (Because files such as +config.js can potentially modify Vike's virtual files.)
      const vikeVirtualFiles = getVikeVirtualFiles(server)
      return vikeVirtualFiles
    } else {
      // Ensure we invalidate `file` *before* server.ssrLoadModule() in updateUserFiles()
      // Vite also invalidates it, but *after* handleHotUpdate() and thus after server.ssrLoadModule()
      ctx.modules.forEach((mod) => server.moduleGraph.invalidateModule(mod))
      await updateUserFiles()
    }
  }
}

async function onFileCreatedOrRemoved(file: string, isRemove: boolean, server: ViteDevServer, config: ResolvedConfig) {
  file = normalizePath(file)
  if (isTemporaryBuildFile(file)) return
  const operation = isRemove ? 'removed' : 'created'
  debugFileChange('server.watcher', file, operation)
  const { moduleGraph } = server
  const isAppFile = await isAppDependency(file, moduleGraph)
  const reload = () => reloadConfig(file, config, operation, server)

  // Vike config (non-runtime) code
  if (isAppFile && isAppFile.isConfigDependency) {
    reload()
    return
  }

  // New + file => not tracked yet by Vike (`vikeConfigObject._vikeConfigDependencies`) nor Vite (`moduleGraph`)
  if (isPlusFile(file)) {
    reload()
    return
  }

  // Vike runtime code => let Vite handle it
  if (isAppFile && isAppFile.isRuntimeDependency) {
    assert(existsInViteModuleGraph(file, moduleGraph))
    return
  }

  // Trick: when fixing the path of a relative import => we don't know whether `file` is the imported file => we take a leap of faith when the conditions below are met.
  // - Not sure how reliable that trick is.
  // - Reloading Vike's config is cheap and file creation/removal is rare => the trick is worth it.
  // - Reproduction:
  //   ```bash
  //   rm someImportedFile.js && sleep 2 && git checkout someImportedFile.js
  //   ```
  if (isScriptFile(file) && getVikeConfigError() && !existsInViteModuleGraph(file, moduleGraph)) {
    reload()
    return
  }
}

async function isAppDependency(filePathAbsoluteFilesystem: string, moduleGraph: ModuleGraph) {
  // =============================
  // { isConfigDependency: false }
  // =============================
  // Vike config (non-runtime) files such as +config.js which aren't processed by Vite.
  // - They're missing in Vite's module graph.
  // - Potentially modifies Vike's virtual files.
  // - Same for all `pages/+config.js` transitive dependencies.
  assertPosixPath(filePathAbsoluteFilesystem)
  const vikeConfigObject = await getVikeConfigInternalOptional()
  if (vikeConfigObject) {
    const { _vikeConfigDependencies: vikeConfigDependencies } = vikeConfigObject
    vikeConfigDependencies.forEach((f) => assertPosixPath(f))
    if (vikeConfigDependencies.has(filePathAbsoluteFilesystem)) return { isConfigDependency: true }
  }

  // =============================
  // { isRuntimeDependency: true }
  // =============================
  // Vike runtime files such as +data.js which are processed by Vite.
  // - They're included in Vite's module graph.
  // - They never modify Vike's virtual files.
  // - Same for all `+data.js` transitive dependencies.
  const importersTransitive = getImportersTransitive(filePathAbsoluteFilesystem, moduleGraph)
  const isPlusValueFileDependency = Array.from(importersTransitive).some(
    (importer) => importer.file && isPlusFile(importer.file),
  )
  if (isPlusValueFileDependency) return { isRuntimeDependency: true }

  // File unrelated to the user's Vite/Vike app, for example:
  //   package.json
  //   .github/workflows/ci.yml
  //   migrations/migration-0123.ts
  //   ...
  /* TO-DO/eventually: this assert should be true?
  assert(!existsInViteModuleGraph(filePathAbsoluteFilesystem, moduleGraph))
  //*/
  return null
}

function reloadConfig(
  filePath: string,
  config: ResolvedConfig,
  operation: 'modified' | 'created' | 'removed',
  server: ViteDevServer,
) {
  // Ensure server.ssrLoadModule() loads fresh Vike virtual files (`reloadConfig()` > `updateUserFiles()` > `server.ssrLoadModule()`)
  invalidateVikeVirtualFiles(server)

  {
    const filePathToShowToUserResolved = getFilePathToShowToUserModule(filePath, config)
    const msg = `${operation} ${pc.dim(filePathToShowToUserResolved)}` as const
    logConfigInfo(msg, 'info')
  }

  reloadVikeConfig()

  updateUserFiles()
}

function invalidateVikeVirtualFiles(server: ViteDevServer) {
  const vikeVirtualFiles = getVikeVirtualFiles(server)
  vikeVirtualFiles.forEach((mod) => {
    server.moduleGraph.invalidateModule(mod)
  })
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

function existsInViteModuleGraph(file: string, moduleGraph: ModuleGraph): boolean {
  return !!moduleGraph.getModulesByFile(file)
}

// Get all ancestors in the module graph. Includes the module itself.
function getImportersTransitive(file: string, moduleGraph: ModuleGraph): Set<ModuleNode> {
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
