export { pluginBuildConfig }
export { assertRollupInput }
export { analyzeClientEntries }
export { pluginAutoFullBuild }
export { isPrerenderForceExit }

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
  requireResolveDistFile,
  assertWarning,
  getGlobalObject,
} from '../../utils.js'
import { getVikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { findPageFiles } from '../../shared/findPageFiles.js'
import type { ResolvedConfig, Plugin, Environment, InlineConfig } from 'vite'
import { generateVirtualFileId } from '../../../shared/virtualFileId.js'
import type { PageConfigBuildTime } from '../../../../types/PageConfig.js'
import type { FileType } from '../../../../shared/getPageFiles/fileTypes.js'
import { extractAssetsAddQuery } from '../../../shared/extractAssetsQuery.js'
import { prependEntriesDir } from '../../../shared/prependEntriesDir.js'
import { getFilePathResolved } from '../../shared/getFilePath.js'
import { getConfigValueBuildTime } from '../../../../shared/page-configs/getConfigValueBuildTime.js'
import { isViteServerSide_withoutEnv, isViteServerSide_onlySsrEnv } from '../../shared/isViteServerSide.js'
import {
  handleAssetsManifest_assertUsageCssCodeSplit,
  handleAssetsManifest_getBuildConfig,
  handleAssetsManifest,
  handleAssetsManifest_assertUsageCssTarget,
} from './handleAssetsManifest.js'
import { resolveIncludeAssetsImportedByServer } from '../../../runtime/renderPage/getPageAssets/retrievePageAssetsProd.js'
import { isPrerenderAutoRunEnabled, wasPrerenderRun } from '../../../prerender/context.js'
import type { VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { isViteCliCall, getViteConfigFromCli } from '../../shared/isViteCliCall.js'
import pc from '@brillout/picocolors'
import { logErrorHint } from '../../../runtime/renderPage/logErrorHint.js'
import { isVikeCliOrApi } from '../../../api/context.js'
import { runPrerenderFromAutoRun } from '../../../prerender/runPrerenderEntry.js'
import { getManifestFilePathRelative } from '../../shared/getManifestFilePathRelative.js'

const globalObject = getGlobalObject('build/pluginAutoFullBuild.ts', {
  forceExit: false,
})

function pluginBuildConfig(): Plugin[] {
  let config: ResolvedConfig

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
      config: {
        order: 'post',
        async handler(config) {
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
  if (isViteServerSide_withoutEnv(config)) {
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
    const clientRoutingEntry = requireResolveDistFile('dist/esm/client/runtime-client-routing/entry.js')
    const serverRoutingEntry = requireResolveDistFile('dist/esm/client/runtime-server-routing/entry.js')
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
  const isForClientSide = !isViteServerSide_withoutEnv(config)
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

function pluginAutoFullBuild(): Plugin[] {
  let config: ResolvedConfig
  return [
    {
      name: 'vike:build:pluginAutoFullBuild',
      apply: 'build',
      enforce: 'pre',
      async configResolved(config_) {
        config = config_
        await abortViteBuildSsr()
      },
      writeBundle: {
        /* We can't use this because it breaks Vite's logging. TO-DO/eventually: try again with latest Vite version.
        sequential: true,
        order: 'pre',
        */
        async handler(options, bundle) {
          try {
            await handleAssetsManifest(config, this.environment, options, bundle)
            await triggerPrerendering(config, this.environment, bundle)
          } catch (err) {
            // We use try-catch also because:
            // - Vite/Rollup swallows errors thrown inside the writeBundle() hook. (It doesn't swallow errors thrown inside the first writeBundle() hook while building the client-side, but it does swallow errors thrown inside the second writeBundle() while building the server-side triggered after Vike calls Vite's `build()` API.)
            // - Avoid Rollup prefixing the error with [vike:build:pluginAutoFullBuild], see for example https://github.com/vikejs/vike/issues/472#issuecomment-1276274203
            console.error(err)
            logErrorHint(err)
            process.exit(1)
          }
        },
      },
    },
    {
      name: 'vike:build:pluginAutoFullBuild:post',
      apply: 'build',
      enforce: 'post',
      closeBundle: {
        sequential: true,
        order: 'post',
        handler() {
          onSetupBuild()
          handleAssetsManifest_assertUsageCssTarget(config, this.environment)
          /* Let vike:build:pluginBuildApp force exit
          runPrerender_forceExit()
          */
        },
      },
    },
  ]
}

async function triggerPrerendering(config: ResolvedConfig, viteEnv: Environment, bundle: Record<string, unknown>) {
  const vikeConfig = await getVikeConfigInternal()
  if (!isViteServerSide_onlySsrEnv(config, viteEnv)) return
  if (isDisabled(vikeConfig)) return
  // Workaround for @vitejs/plugin-legacy
  //  - The legacy plugin triggers its own Rollup build for the client-side.
  //  - The legacy plugin doesn't generate a manifest => we can use that to detect the legacy plugin build.
  //  - Issue & reproduction: https://github.com/vikejs/vike/issues/1154#issuecomment-1965954636
  if (!bundle[getManifestFilePathRelative(config.build.manifest)]) return

  const configInline = getFullBuildInlineConfig(config)

  if (isPrerenderAutoRunEnabled(vikeConfig)) {
    const res = await runPrerenderFromAutoRun(configInline)
    globalObject.forceExit = res.forceExit
    assert(wasPrerenderRun())
  }
}

async function abortViteBuildSsr() {
  const vikeConfig = await getVikeConfigInternal()
  if (vikeConfig.config.disableAutoFullBuild !== true && isViteCliCall() && getViteConfigFromCli()?.build.ssr) {
    assertWarning(
      false,
      `The CLI call ${pc.cyan('$ vite build --ssr')} is superfluous since ${pc.cyan(
        '$ vite build',
      )} also builds the server-side. If you want two separate build steps then use https://vike.dev/disableAutoFullBuild or use Vite's ${pc.cyan(
        'build()',
      )} API.`,
      { onlyOnce: true },
    )
    process.exit(0)
  }
}

function isDisabled(vikeConfig: VikeConfigInternal): boolean {
  const { disableAutoFullBuild } = vikeConfig.config
  if (disableAutoFullBuild === undefined || disableAutoFullBuild === 'prerender') {
    const isUserUsingViteApi = !isViteCliCall() && !isVikeCliOrApi()
    return isUserUsingViteApi
  } else {
    return disableAutoFullBuild
  }
}

function isPrerenderForceExit(): boolean {
  return globalObject.forceExit
}

function getFullBuildInlineConfig(config: ResolvedConfig): InlineConfig {
  const configFromCli = !isViteCliCall() ? null : getViteConfigFromCli()
  if (config._viteConfigFromUserEnhanced) {
    return config._viteConfigFromUserEnhanced
  } else {
    return {
      ...configFromCli,
      configFile: configFromCli?.configFile || config.configFile,
      root: config.root,
      build: {
        ...configFromCli?.build,
      },
    }
  }
}
