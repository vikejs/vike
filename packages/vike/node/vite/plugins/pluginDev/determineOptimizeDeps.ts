export { determineOptimizeDeps }

import type { ResolvedConfig } from 'vite'
import { findPageFiles } from '../../shared/findPageFiles.js'
import {
  assert,
  assertIsImportPathNpmPackage,
  createDebugger,
  getNpmPackageName,
  isArray,
  isFilePathAbsoluteFilesystem,
  isVirtualFileId,
} from '../../utils.js'
import { getVikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { analyzeClientEntries } from '../pluginBuild/pluginBuildConfig.js'
import type { DefinedAtFilePath, PageConfigBuildTime } from '../../../../types/PageConfig.js'
import {
  virtualFileIdEntryClientCR,
  virtualFileIdEntryClientSR,
} from '../../../shared/virtualFiles/virtualFileEntry.js'
import { getFilePathResolved } from '../../shared/getFilePath.js'
import { getConfigValueSourcesRelevant } from '../pluginVirtualFiles/isRuntimeEnvMatch.js'

const debug = createDebugger('vike:optimizeDeps')

async function determineOptimizeDeps(config: ResolvedConfig) {
  const vikeConfig = await getVikeConfigInternal()
  const { _pageConfigs: pageConfigs } = vikeConfig

  const { entriesClient, entriesServer, includeClient, includeServer } = await getPageDeps(config, pageConfigs)
  config.optimizeDeps.include = add(config.optimizeDeps.include, includeClient)
  config.optimizeDeps.entries = add(config.optimizeDeps.entries, entriesClient)

  // Workaround until https://github.com/vitejs/vite-plugin-react/issues/650
  // - TODO/soon: remove workaround once https://github.com/vitejs/vite/pull/20495 is released
  includeServer.push('react/jsx-dev-runtime')

  for (const envName in config.environments) {
    const env = config.environments[envName]!
    if (env.consumer === 'server' && env.optimizeDeps.noDiscovery === false) {
      env.optimizeDeps.include = add(env.optimizeDeps.include, includeServer)
      env.optimizeDeps.entries = add(env.optimizeDeps.entries, entriesServer)
    }
  }

  if (debug.isActivated)
    debug('optimizeDeps', {
      'config.optimizeDeps.entries': config.optimizeDeps.entries,
      'config.optimizeDeps.include': config.optimizeDeps.include,
      'config.optimizeDeps.exclude': config.optimizeDeps.exclude,
      // @ts-ignore Vite doesn't seem to support ssr.optimizeDeps.entries (vite@7.0.6, July 2025)
      'config.ssr.optimizeDeps.entries': config.ssr.optimizeDeps.entries,
      'config.ssr.optimizeDeps.include': config.ssr.optimizeDeps.include,
      'config.ssr.optimizeDeps.exclude': config.ssr.optimizeDeps.exclude,
    })
}

async function getPageDeps(config: ResolvedConfig, pageConfigs: PageConfigBuildTime[]) {
  let entriesClient: string[] = []
  let entriesServer: string[] = []
  let includeClient: string[] = []
  let includeServer: string[] = []

  const addEntry = (e: string, isForClientSide: boolean, definedAt?: DefinedAtFilePath) => {
    assert(e)
    // optimizeDeps.entries expects filesystem absolute paths
    assert(isVirtualFileId(e) || isFilePathAbsoluteFilesystem(e))

    if (isExcluded(e, isForClientSide, definedAt)) return

    if (isForClientSide) {
      entriesClient.push(e)
    } else {
      entriesServer.push(e)
    }
  }
  const addInclude = (e: string, isForClientSide: boolean, definedAt?: DefinedAtFilePath) => {
    assert(e)
    // optimizeDeps.include expects npm packages
    assert(!e.startsWith('/'))
    // Shouldn't be a path alias, as path aliases would need to be added to optimizeDeps.entries instead of optimizeDeps.include
    assertIsImportPathNpmPackage(e)

    if (isExcluded(e, isForClientSide, definedAt)) return

    if (isForClientSide) {
      includeClient.push(e)
    } else {
      includeServer.push(e)
    }
  }
  const isExcluded = (e: string, isForClientSide: boolean, definedAt?: DefinedAtFilePath) => {
    const exclude = isForClientSide ? config.optimizeDeps.exclude : config.ssr.optimizeDeps.exclude
    if (!exclude) return false
    if (definedAt?.importPathAbsolute) {
      const npmPackageName = getNpmPackageName(definedAt.importPathAbsolute)
      if (npmPackageName && exclude.includes(npmPackageName)) return true
    }
    return exclude.includes(e)
  }

  // V1 design
  {
    ;[true, false].forEach((isForClientSide) => {
      pageConfigs.forEach((pageConfig) => {
        Object.entries(pageConfig.configValueSources).forEach(([configName]) => {
          const runtimeEnv = {
            isForClientSide,
            isDev: true,
            // TO-DO/eventually/remove-server-router: let's eventually remove support for Server Routing
            isClientRouting: true,
          }
          const sourcesRelevant = getConfigValueSourcesRelevant(configName, runtimeEnv, pageConfig)
          sourcesRelevant.forEach((configValueSource) => {
            if (!configValueSource.valueIsLoadedWithImport && !configValueSource.valueIsFilePath) return
            const { definedAt } = configValueSource

            if (definedAt.definedBy) return

            if (definedAt.filePathAbsoluteUserRootDir !== null) {
              addEntry(
                // optimizeDeps.entries expects filesystem absolute paths
                definedAt.filePathAbsoluteFilesystem,
                isForClientSide,
                definedAt,
              )
            } else {
              addInclude(
                // optimizeDeps.include expects npm packages
                definedAt.importPathAbsolute,
                isForClientSide,
                definedAt,
              )
            }
          })
        })
      })
    })
  }

  // V0.4 design
  {
    const pageFiles = await findPageFiles(config, ['.page', '.page.client'], true)
    const userRootDir = config.root
    pageFiles.forEach((filePathAbsoluteUserRootDir) => {
      const entry = getFilePathResolved({ filePathAbsoluteUserRootDir, userRootDir })
      const { filePathAbsoluteFilesystem } = entry
      addEntry(filePathAbsoluteFilesystem, true)
    })
  }

  // Add virtual files.
  // - This doesn't work: Vite's dep optimizer doesn't seem to be able to crawl virtual files.
  //   - Should we make it work? E.g. by creating a temporary file at node_modules/.vike/virtualFiles.js
  //   - Or should we remove it? And make sure getPageDeps() also works for aliased import paths
  //     - If we do, then we need to adjust include/entries (maybe by making include === entries -> will Vite complain?)
  {
    const { hasClientRouting, hasServerRouting, clientEntries } = analyzeClientEntries(pageConfigs, config)
    Object.values(clientEntries).forEach((e) => addEntry(e, true))
    if (hasClientRouting) addEntry(virtualFileIdEntryClientCR, true)
    if (hasServerRouting) addEntry(virtualFileIdEntryClientSR, true)
  }

  entriesClient = entriesClient
  entriesServer = entriesServer
  includeClient = includeClient
  includeServer = includeServer
  return {
    entriesClient,
    entriesServer,
    includeClient,
    includeServer,
  }
}

function add(input: string | string[] | undefined, listAddendum: string[]): string[] {
  const list = !input ? [] : isArray(input) ? unique(input) : [input]
  listAddendum.forEach((e) => {
    if (!list.includes(e)) list.push(e)
  })
  return list
}
function unique<T>(arr: T[]): T[] {
  const arrUnique = Array.from(new Set(arr))
  return arr.length !== arrUnique.length ? arrUnique : arr
}
