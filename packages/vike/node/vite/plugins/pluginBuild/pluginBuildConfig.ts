export { pluginBuildConfig }
export { assertRollupInput }
export { analyzeClientEntries }

import {
  assert,
  addOnBeforeLogHook,
  removeFileExtension,
  unique,
  assertUsage,
  injectRollupInputs,
  normalizeRollupInput,
  onSetupBuild,
  assertIsImportPathNpmPackage,
  requireResolveVikeDistFile,
} from '../../utils.js'
import { getVikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { findPageFiles } from '../../shared/findPageFiles.js'
import type { ResolvedConfig, Plugin, UserConfig } from 'vite'
import { generateVirtualFileId } from '../../../shared/virtualFileId.js'
import type { PageConfigBuildTime } from '../../../../types/PageConfig.js'
import type { FileType } from '../../../../shared/getPageFiles/fileTypes.js'
import { extractAssetsAddQuery } from '../../../shared/extractAssetsQuery.js'
import { prependEntriesDir } from '../../../shared/prependEntriesDir.js'
import { getFilePathResolved } from '../../shared/getFilePath.js'
import { getConfigValueBuildTime } from '../../../../shared/page-configs/getConfigValueBuildTime.js'
import { isViteServerBuild } from '../../shared/isViteServerBuild.js'
import { resolveOutDir_configEnvironment } from '../../shared/getOutDirs.js'
import {
  handleAssetsManifest_assertUsageCssCodeSplit,
  handleAssetsManifest_getBuildConfig,
} from './handleAssetsManifest.js'
import { resolveIncludeAssetsImportedByServer } from '../../../runtime/renderPage/getPageAssets/retrievePageAssetsProd.js'

function pluginBuildConfig(): Plugin[] {
  let config: ResolvedConfig
  let configUnresolved: UserConfig

  return [
    {
      name: 'vike:build:pluginBuildConfig',
      apply: 'build',
      enforce: 'post',
      configResolved: {
        order: 'post',
        async handler(config_) {
          onSetupBuild()
          config = config_
          assertRollupInput(config)
          const entries = await getEntries(config)
          assert(Object.keys(entries).length > 0)
          config.build.rollupOptions.input = injectRollupInputs(entries, config)
          addLogHook()
          handleAssetsManifest_assertUsageCssCodeSplit(config)
        },
      },
      configEnvironment: {
        order: 'post',
        async handler(envName, configEnv) {
          assert(configUnresolved)
          return {
            build: {
              outDir: resolveOutDir_configEnvironment(configUnresolved, envName, configEnv),
            },
          }
        },
      },
      config: {
        order: 'post',
        async handler(config) {
          configUnresolved = config
          onSetupBuild()
          const build = await handleAssetsManifest_getBuildConfig(config)
          return { build }
        },
      },
      buildStart() {
        onSetupBuild()
      },
    },
  ]
}

async function getEntries(config: ResolvedConfig): Promise<Record<string, string>> {
  const vikeConfig = await getVikeConfigInternal()
  const { _pageConfigs: pageConfigs } = vikeConfig
  // TO-DO/next-major-release: remove
  const pageFileEntries = await getPageFileEntries(config, resolveIncludeAssetsImportedByServer(vikeConfig.config))
  assertUsage(
    Object.keys(pageFileEntries).length !== 0 || pageConfigs.length !== 0,
    'At least one page should be defined, see https://vike.dev/add',
  )
  if (isViteServerBuild(config, undefined)) {
    const pageEntries = getPageEntries(pageConfigs)
    const entries = {
      ...pageFileEntries,
      // Ensure Rollup generates a bundle per page: https://github.com/vikejs/vike/issues/349#issuecomment-1166247275
      ...pageEntries,
    }
    return entries
  } else {
    let { hasClientRouting, hasServerRouting, clientEntries } = analyzeClientEntries(pageConfigs, config)
    if (Object.entries(pageFileEntries).length > 0) {
      hasClientRouting = true
      hasServerRouting = true
    }
    const entries: Record<string, string> = {
      ...clientEntries,
      ...pageFileEntries,
    }
    const clientRoutingEntry = requireResolveVikeDistFile('dist/esm/client/runtime-client-routing/entry.js')
    const serverRoutingEntry = requireResolveVikeDistFile('dist/esm/client/runtime-server-routing/entry.js')
    if (hasClientRouting) {
      entries['entries/entry-client-routing'] = clientRoutingEntry
    }
    if (hasServerRouting) {
      entries['entries/entry-server-routing'] = serverRoutingEntry
    }
    return entries
  }
}
function getPageEntries(pageConfigs: PageConfigBuildTime[]) {
  const pageEntries: Record<string, string> = {}
  pageConfigs.forEach((pageConfig) => {
    const { entryName, entryTarget } = getEntryFromPageConfig(pageConfig, false)
    pageEntries[entryName] = entryTarget
  })
  return pageEntries
}
function analyzeClientEntries(pageConfigs: PageConfigBuildTime[], config: ResolvedConfig) {
  let hasClientRouting = false
  let hasServerRouting = false
  let clientEntries: Record<string, string> = {}
  let clientEntryList: string[] = []
  pageConfigs.forEach((pageConfig) => {
    const configValue = getConfigValueBuildTime(pageConfig, 'clientRouting', 'boolean')
    if (configValue?.value) {
      hasClientRouting = true
    } else {
      hasServerRouting = true
    }
    {
      // Ensure Rollup generates a bundle per page: https://github.com/vikejs/vike/issues/349#issuecomment-1166247275
      const { entryName, entryTarget } = getEntryFromPageConfig(pageConfig, true)
      clientEntries[entryName] = entryTarget
    }
    {
      const clientEntry = getConfigValueBuildTime(pageConfig, 'client', 'string')?.value ?? null
      if (clientEntry) {
        clientEntryList.push(clientEntry)
      }
    }
  })
  clientEntryList = unique(clientEntryList)
  clientEntryList.forEach((clientEntry) => {
    const { entryName, entryTarget } = getEntryFromClientEntry(clientEntry, config)
    clientEntries[entryName] = entryTarget
  })

  return { hasClientRouting, hasServerRouting, clientEntries }
}

// Ensure Rollup creates entries for each page file, see https://github.com/vikejs/vike/issues/350
// (Otherwise the page files may be missing in the client manifest.json)
async function getPageFileEntries(config: ResolvedConfig, includeAssetsImportedByServer: boolean) {
  const isForClientSide = !isViteServerBuild(config, undefined)
  const fileTypes: FileType[] = isForClientSide ? ['.page', '.page.client'] : ['.page', '.page.server']
  if (isForClientSide && includeAssetsImportedByServer) {
    fileTypes.push('.page.server')
  }
  let pageFiles = await findPageFiles(config, fileTypes, false)
  const pageFileEntries: Record<string, string> = {}
  pageFiles = unique(pageFiles)
  pageFiles.forEach((pageFile) => {
    let addExtractAssetsQuery = false
    if (isForClientSide && pageFile.includes('.page.server.')) {
      assert(includeAssetsImportedByServer)
      addExtractAssetsQuery = true
    }
    const { entryName, entryTarget } = getEntryFromClientEntry(pageFile, config, addExtractAssetsQuery)
    pageFileEntries[entryName] = entryTarget
  })
  return pageFileEntries
}

function getEntryFromClientEntry(clientEntry: string, config: ResolvedConfig, addExtractAssetsQuery?: boolean) {
  if (!clientEntry.startsWith('/')) {
    assertIsImportPathNpmPackage(clientEntry)
    const entryTarget = clientEntry
    const entryName = prependEntriesDir(clientEntry)
    return { entryName, entryTarget }
  }

  const filePathAbsoluteUserRootDir = clientEntry
  assert(filePathAbsoluteUserRootDir.startsWith('/'))

  const filePath = getFilePathResolved({
    filePathAbsoluteUserRootDir,
    userRootDir: config.root,
  })
  let entryTarget = filePath.filePathAbsoluteFilesystem
  if (addExtractAssetsQuery) entryTarget = extractAssetsAddQuery(entryTarget)

  let entryName = filePathAbsoluteUserRootDir
  if (addExtractAssetsQuery) entryName = extractAssetsAddQuery(entryName)
  entryName = removeFileExtension(entryName)
  entryName = prependEntriesDir(entryName)

  return { entryName, entryTarget }
}
function getEntryFromPageConfig(pageConfig: PageConfigBuildTime, isForClientSide: boolean) {
  let { pageId } = pageConfig
  const entryTarget = generateVirtualFileId({ type: 'page-entry', pageId, isForClientSide })
  let entryName = pageId
  // Avoid:
  // ```
  // dist/client/assets/entries/.Dp9wM6PK.js
  // dist/server/entries/.mjs
  // ```
  if (entryName === '/') entryName = 'root'
  entryName = prependEntriesDir(entryName)
  assert(!entryName.endsWith('/'))
  return { entryName, entryTarget }
}

function addLogHook() {
  const tty = process.stdout.isTTY && !process.env.CI // Equals https://github.com/vitejs/vite/blob/193d55c7b9cbfec5b79ebfca276d4a721e7de14d/packages/vite/src/node/plugins/reporter.ts#L27
  if (!tty) return
  let lastLog: string | null = null
  ;(['stdout', 'stderr'] as const).forEach((stdName) => {
    var methodOriginal = process[stdName].write
    process[stdName].write = function (...args) {
      lastLog = String(args[0])
      return methodOriginal.apply(process[stdName], args as any)
    }
  })
  // Exhaustive list extracted from writeLine() calls at https://github.com/vitejs/vite/blob/193d55c7b9cbfec5b79ebfca276d4a721e7de14d/packages/vite/src/node/plugins/reporter.ts
  // prettier-ignore
  // biome-ignore format:
  const viteTransientLogs = [
    'transforming (',
    'rendering chunks (',
    'computing gzip size ('
  ]
  addOnBeforeLogHook(() => {
    // Using viteTransientLogs is very conservative as clearing the current line is low risk. (We can assume that important messages, such as errors, include a trailing new line. Usually, only transient messages have no trailing new lines.)
    if (viteTransientLogs.some((s) => lastLog?.startsWith(s))) {
      process.stdout.clearLine(0)
      process.stdout.cursorTo(0)
    }
  })
}

function assertRollupInput(config: ResolvedConfig): void {
  const userInputs = normalizeRollupInput(config.build.rollupOptions.input)
  const htmlInputs = Object.values(userInputs).filter((entry) => entry.endsWith('.html') || entry.endsWith('.htm'))
  const htmlInput = htmlInputs[0]
  assertUsage(
    htmlInput === undefined,
    `The entry ${htmlInput} of config build.rollupOptions.input is an HTML entry which is forbidden when using Vike, instead follow https://vike.dev/add`,
  )
}
