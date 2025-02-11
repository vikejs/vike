export { buildConfig }
export { assertRollupInput }
export { analyzeClientEntries }
export { manifestTempFile }

import {
  assert,
  addOnBeforeLogHook,
  removeFileExtention,
  unique,
  assertUsage,
  injectRollupInputs,
  normalizeRollupInput,
  onSetupBuild,
  assertIsNpmPackageImport
} from '../utils.js'
import { getVikeConfig, isV1Design } from './importUserCode/v1-design/getVikeConfig.js'
import { findPageFiles } from '../shared/findPageFiles.js'
import type { ResolvedConfig, Plugin, UserConfig } from 'vite'
import { getVirtualFileIdPageConfigValuesAll } from '../../shared/virtual-files/virtualFilePageConfigValuesAll.js'
import type { PageConfigBuildTime } from '../../../shared/page-configs/PageConfig.js'
import type { FileType } from '../../../shared/getPageFiles/fileTypes.js'
import { extractAssetsAddQuery } from '../../shared/extractAssetsQuery.js'
import { createRequire } from 'module'
import fs from 'fs/promises'
import path from 'path'
import {
  fixServerAssets,
  fixServerAssets_assertCssCodeSplit,
  fixServerAssets_assertCssTarget,
  fixServerAssets_isEnabled
} from './buildConfig/fixServerAssets.js'
import { set_ASSETS_MANIFEST } from './buildEntry/index.js'
import { prependEntriesDir } from '../../shared/prependEntriesDir.js'
import { getFilePathResolved } from '../shared/getFilePath.js'
import { getConfigValueBuildTime } from '../../../shared/page-configs/getConfigValueBuildTime.js'
import { getOutDirs, type OutDirs, resolveOutDir } from '../shared/getOutDirs.js'
import { viteIsSSR } from '../shared/viteIsSSR.js'
// @ts-ignore Shimmed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)
const manifestTempFile = '_temp_manifest.json'

function buildConfig(): Plugin[] {
  let isServerAssetsFixEnabled: boolean
  let outDirs: OutDirs
  let config: ResolvedConfig
  return [
    {
      name: 'vike:buildConfig:post',
      apply: 'build',
      enforce: 'post',
      configResolved: {
        order: 'post',
        async handler(config_) {
          config = config_
          onSetupBuild()
          assertRollupInput(config)
          const entries = await getEntries(config)
          assert(Object.keys(entries).length > 0)
          config.build.rollupOptions.input = injectRollupInputs(entries, config)
          addLogHook()
          outDirs = getOutDirs(config)
          {
            isServerAssetsFixEnabled = fixServerAssets_isEnabled() && (await isV1Design(config))
            if (isServerAssetsFixEnabled) {
              // https://github.com/vikejs/vike/issues/1339
              config.build.ssrEmitAssets = true
              // Required if `ssrEmitAssets: true`, see https://github.com/vitejs/vite/pull/11430#issuecomment-1454800934
              config.build.cssMinify = 'esbuild'
              fixServerAssets_assertCssCodeSplit(config)
            }
          }
        }
      },
      config: {
        order: 'post',
        handler(config) {
          onSetupBuild()
          return {
            build: {
              outDir: resolveOutDir(config),
              manifest: manifestTempFile,
              copyPublicDir: config.vike!.config.viteEnvironmentAPI
                ? // Already set by buildApp() plugin
                  undefined
                : !viteIsSSR(config)
            }
          } satisfies UserConfig
        }
      },
      buildStart() {
        onSetupBuild()
      },
      async closeBundle() {
        onSetupBuild()
        await fixServerAssets_assertCssTarget(config)
      }
    },
    {
      name: 'vike:buildConfig:pre',
      apply: 'build',
      // Make sure other writeBundle() hooks are called after this writeBundle() hook.
      //  - set_ASSETS_MANIFEST() needs to be called before dist/server/ code is executed.
      //    - For example, the writeBundle() hook of vite-plugin-vercel needs to be called after this writeBundle() hook, otherwise: https://github.com/vikejs/vike/issues/1527
      enforce: 'pre',
      writeBundle: {
        order: 'pre',
        sequential: true,
        async handler(options, bundle) {
          if (viteIsSSR(config)) {
            // Ideally we'd move dist/_temp_manifest.json to dist/server/client-assets.json instead of dist/assets.json
            //  - But we can't because there is no guarentee whether dist/server/ is generated before or after dist/client/ (generating dist/server/ after dist/client/ erases dist/server/client-assets.json)
            //  - We'll able to do so once we replace `$ vite build` with `$ vike build`
            const assetsJsonFilePath = path.posix.join(outDirs.outDirRoot, 'assets.json')
            const clientManifestFilePath = path.posix.join(outDirs.outDirClient, manifestTempFile)
            const serverManifestFilePath = path.posix.join(outDirs.outDirServer, manifestTempFile)
            if (!isServerAssetsFixEnabled) {
              await fs.copyFile(clientManifestFilePath, assetsJsonFilePath)
            } else {
              const { clientManifestMod } = await fixServerAssets(config)
              await fs.writeFile(assetsJsonFilePath, JSON.stringify(clientManifestMod, null, 2), 'utf-8')
            }
            await fs.rm(clientManifestFilePath)
            await fs.rm(serverManifestFilePath)
            await set_ASSETS_MANIFEST(options, bundle)
          }
        }
      }
    }
  ]
}

async function getEntries(config: ResolvedConfig): Promise<Record<string, string>> {
  const vikeConfig = await getVikeConfig(config)
  const { pageConfigs } = vikeConfig
  // TODO/v1-release: remove
  const pageFileEntries = await getPageFileEntries(
    config,
    // TODO/now: add meta.default
    vikeConfig.global.config.includeAssetsImportedByServer ?? true
  )
  assertUsage(
    Object.keys(pageFileEntries).length !== 0 || pageConfigs.length !== 0,
    'At least one page should be defined, see https://vike.dev/add'
  )
  if (viteIsSSR(config)) {
    const pageEntries = getPageEntries(pageConfigs)
    const entries = {
      // buildEntry: resolve('dist/esm/node/buildEntry.js'), // TODO/next-major-release: remove
      ...pageFileEntries,
      // Ensure Rollup generates a bundle per page: https://github.com/vikejs/vike/issues/349#issuecomment-1166247275
      ...pageEntries
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
      ...pageFileEntries
    }
    const clientRoutingEntry = resolve(`dist/esm/client/client-routing-runtime/entry.js`)
    const serverRoutingEntry = resolve(`dist/esm/client/server-routing-runtime/entry.js`)
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
  const isForClientSide = !viteIsSSR(config)
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
    assertIsNpmPackageImport(clientEntry)
    const entryTarget = clientEntry
    const entryName = prependEntriesDir(clientEntry)
    return { entryName, entryTarget }
  }

  const filePathAbsoluteUserRootDir = clientEntry
  assert(filePathAbsoluteUserRootDir.startsWith('/'))

  const filePath = getFilePathResolved({
    filePathAbsoluteUserRootDir,
    userRootDir: config.root
  })
  let entryTarget = filePath.filePathAbsoluteFilesystem
  if (addExtractAssetsQuery) entryTarget = extractAssetsAddQuery(entryTarget)

  let entryName = filePathAbsoluteUserRootDir
  if (addExtractAssetsQuery) entryName = extractAssetsAddQuery(entryName)
  entryName = removeFileExtention(entryName)
  entryName = prependEntriesDir(entryName)

  return { entryName, entryTarget }
}
function getEntryFromPageConfig(pageConfig: PageConfigBuildTime, isForClientSide: boolean) {
  let { pageId } = pageConfig
  const entryTarget = getVirtualFileIdPageConfigValuesAll(pageId, isForClientSide)
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

function resolve(filePath: string) {
  assert(filePath.startsWith('dist/'))
  // [RELATIVE_PATH_FROM_DIST] Current directory: node_modules/vike/dist/esm/node/plugin/plugins/
  return require_.resolve(`../../../../../${filePath}`)
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
    `The entry ${htmlInput} of config build.rollupOptions.input is an HTML entry which is forbidden when using Vike, instead follow https://vike.dev/add`
  )
}
