import '../assertEnvVite.js'

export { pluginVirtualFiles }

import type { Plugin, ResolvedConfig, HmrContext, ViteDevServer, ModuleNode, ModuleGraph } from 'vite'
import { normalizePath } from 'vite'
import { generateVirtualFilePageEntry } from './pluginVirtualFiles/generateVirtualFilePageEntry.js'
import { generateVirtualFileGlobalEntryWithOldDesign } from './pluginVirtualFiles/generateVirtualFileGlobalEntryWithOldDesign.js'
import { escapeRegex } from '../../../utils/escapeRegex.js'
import { isScriptFile } from '../../../utils/isScriptFile.js'
import {
  addVirtualFileIdPrefix,
  isVirtualFileId,
  removeVirtualFileIdPrefix,
  virtualFileIdPrefix1,
  virtualFileIdPrefix2,
} from '../../../utils/virtualFileId.js'
import { assert } from '../../../utils/assert.js'
import { assertPosixPath } from '../../../utils/path.js'
import { parseVirtualFileId } from '../../../shared-server-node/virtualFileId.js'
import { reloadVikeConfig, isV1Design, getVikeConfigInternalOptional } from '../shared/resolveVikeConfigInternal.js'
import pc from '@brillout/picocolors'
import { logConfigInfo } from '../shared/loggerDev.js'
import { getFilePathToShowToUserModule } from '../shared/getFilePath.js'
import { updateUserFiles } from '../../../server/runtime/globalContext.js'
import { isPlusFile } from '../shared/resolveVikeConfigInternal/crawlPlusFilePaths.js'
import { isTemporaryBuildFile } from '../shared/resolveVikeConfigInternal/transpileAndExecuteFile.js'
import { debugFileChange, getVikeConfigError } from '../../../shared-server-node/getVikeConfigError.js'

// === Rolldown filter
const filterRolldown = {
  id: {
    include: new RegExp(`^(${escapeRegex(virtualFileIdPrefix1)}|${escapeRegex(virtualFileIdPrefix2)})`),
  },
}
const filterFunction = (id: string) => isVirtualFileId(id)
// ===

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
  if (!isAppFile) return

  if (isAppFile.isRuntimeDependency) {
    // Ensure we invalidate `file` *before* server.ssrLoadModule() in updateUserFiles()
    // Vite also invalidates it, but *after* handleHotUpdate() and thus after server.ssrLoadModule()
    ctx.modules.forEach((mod) => server.moduleGraph.invalidateModule(mod))
    // Re-running ssrLoadModule() is cheap (Vite uses a cache) => eagerly calling updateUserFiles() makes sense.
    // - Even for SPA apps that don't have (m)any server files? Ideally, we should set `isRuntimeDependency: true` only for server modules (let's do it once Vite has a clear separate per-environment module graphs).
    await updateUserFiles()
  }

  if (isAppFile.isConfigDependency) {
    /* Tailwind breaks this assertion, see https://github.com/vikejs/vike/discussions/1330#discussioncomment-7787238
    const isViteModule = ctx.modules.length > 0
    assert(!isViteModule)
    */

    reloadAll(file, config, 'modified', server)

    // Trigger a full page reload. (Because files such as +config.js can potentially modify Vike's virtual files.)
    const vikeVirtualFiles = getVikeVirtualFiles(server)
    return vikeVirtualFiles
  }
}

async function onFileCreatedOrRemoved(file: string, isRemove: boolean, server: ViteDevServer, config: ResolvedConfig) {
  file = normalizePath(file)
  if (isTemporaryBuildFile(file)) return
  const operation = isRemove ? 'removed' : 'created'
  debugFileChange('server.watcher', file, operation)
  const { moduleGraph } = server
  const isAppFile = await isAppDependency(file, moduleGraph)

  if (
    // Vike config (non-runtime) code
    isAppFile?.isConfigDependency ||
    // New + file => not tracked yet by Vike (`vikeConfigObject._vikeConfigDependencies`) nor Vite (`moduleGraph`)
    isPlusFile(file) ||
    // Trick: when fixing the path of a relative import => we don't know whether `file` is the imported file => we take a leap of faith when the conditions below are met.
    // - Reloading Vike's config is cheap => eagerly reloading it makes sense when it's in an erroneous state.
    // - Not sure how reliable that trick is.
    // - Reproduction:
    //   ```bash
    //   rm someImportedFile.js && sleep 2 && git checkout someImportedFile.js
    //   ```
    (isScriptFile(file) && getVikeConfigError())
  ) {
    reloadAll(file, config, operation, server)
  }
}

async function isAppDependency(filePathAbsoluteFilesystem: string, moduleGraph: ModuleGraph) {
  const isAppFile: Partial<{ isConfigDependency: boolean; isRuntimeDependency: boolean }> = {}

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
    isAppFile.isConfigDependency = vikeConfigDependencies.has(filePathAbsoluteFilesystem)
  }

  // =============================
  // { isRuntimeDependency: true }
  // =============================
  // Vike runtime files such as +data.js which are processed by Vite.
  // - They're included in Vite's module graph.
  // - They never modify Vike's virtual files.
  // - Same for all `+data.js` transitive dependencies.
  isAppFile.isRuntimeDependency = existsInViteModuleGraph(filePathAbsoluteFilesystem, moduleGraph)

  return isAppFile
}

function reloadAll(
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
