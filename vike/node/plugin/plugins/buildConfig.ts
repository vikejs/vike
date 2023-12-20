export { buildConfig }
export { assertRollupInput }
export { analyzeClientEntries }

import {
  assert,
  resolveOutDir,
  viteIsSSR,
  getFilePathAbsolute,
  addOnBeforeLogHook,
  removeFileExtention,
  unique,
  assertPosixPath,
  assertUsage,
  injectRollupInputs,
  normalizeRollupInput,
  getOutDirs
} from '../utils.js'
import { virtualFileIdImportUserCodeServer } from '../../shared/virtual-files/virtualFileImportUserCode.js'
import { getVikeConfig } from './importUserCode/v1-design/getVikeConfig.js'
import { getConfigValue } from '../../../shared/page-configs/helpers.js'
import { findPageFiles } from '../shared/findPageFiles.js'
import { getConfigVike } from '../../shared/getConfigVike.js'
import type { ResolvedConfig, Plugin, UserConfig } from 'vite'
import { getVirtualFileIdPageConfigValuesAll } from '../../shared/virtual-files/virtualFilePageConfigValuesAll.js'
import type { PageConfigBuildTime } from '../../../shared/page-configs/PageConfig.js'
import type { FileType } from '../../../shared/getPageFiles/fileTypes.js'
import { createRequire } from 'module'
import { getClientEntryFilePath } from '../../shared/getClientEntryFilePath.js'
import fs from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
// @ts-ignore Shimmed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

const manifestTempFile = '_temp_manifest.json'

function buildConfig(): Plugin {
  let generateManifest: boolean
  let isSsrBuild = false
  let outDirs: ReturnType<typeof getOutDirs>
  return {
    name: 'vike:buildConfig',
    apply: 'build',
    enforce: 'post',
    configResolved: {
      order: 'post',
      async handler(config) {
        assertRollupInput(config)
        const entries = await getEntries(config)
        assert(Object.keys(entries).length > 0)
        config.build.rollupOptions.input = injectRollupInputs(entries, config)
        addLogHook()
        outDirs = getOutDirs(config)
      }
    },
    config(config) {
      isSsrBuild = viteIsSSR(config)
      return {
        build: {
          outDir: resolveOutDir(config),
          manifest: manifestTempFile,
          copyPublicDir: !isSsrBuild,
          ssrEmitAssets: true,
          cssMinify: 'esbuild'
        }
      } satisfies UserConfig
    },
    writeBundle: {
      sequential: true,
      async handler(options, bundle) {
        const manifestEntry = bundle[manifestTempFile]
        /* Fails with @vitejs/plugin-legacy because writeBundle() is called twice during the client build (once for normal client assets and a second time for legacy assets), see reproduction at https://github.com/vikejs/vike/issues/1154
        assert(generateManifest === !!manifestEntry)
        */
        if (manifestEntry) {
          const { dir } = options
          assert(dir)
          const manifestFilePathOld = path.join(dir, manifestEntry.fileName)
          // Ideally we'd move dist/_temp_manifest.json to dist/server/client-assets.json instead of dist/assets.json
          //  - But we can't because there is no guarentee whether dist/server/ is generated before or after dist/client/ (generating dist/server/ after dist/client/ erases dist/server/client-assets.json)
          //  - We'll able to do so once we replace `$ vite build` with `$ vike build`
          const manifestFilePathNew = path.join(dir, '..', 'assets.json')
          if (isSsrBuild) {
            const clientManifest = JSON.parse(await fs.readFile(manifestFilePathNew, 'utf-8').catch(() => '{}'))
            const serverManifest = JSON.parse(await fs.readFile(manifestFilePathOld, 'utf-8'))

            // TODO: smarter merge and avoid duplicates
            const mergedManifest = { ...clientManifest, ...serverManifest }
            await fs.writeFile(manifestFilePathOld, JSON.stringify(mergedManifest), 'utf-8')
          }
          await fs.rename(manifestFilePathOld, manifestFilePathNew)
        }
      }
    },
    async closeBundle() {
      if (!isSsrBuild) return
      const assetsDirServerAbs = path.posix.join(outDirs.outDirServer, 'assets')
      const assetsDirClientAbs = path.posix.join(outDirs.outDirClient, 'assets')
      if (!existsSync(assetsDirServerAbs)) {
        return
      }
      //TODO: This can create duplicates
      await fs.cp(assetsDirServerAbs, assetsDirClientAbs, { recursive: true, force: true })
      await fs.rm(assetsDirServerAbs, { recursive: true })
    }
  }
}

async function getEntries(config: ResolvedConfig): Promise<Record<string, string>> {
  const configVike = await getConfigVike(config)
  const pageFileEntries = await getPageFileEntries(config, configVike.includeAssetsImportedByServer) // TODO/v1-release: remove
  const { pageConfigs } = await getVikeConfig(config, false)
  assertUsage(
    Object.keys(pageFileEntries).length !== 0 || pageConfigs.length !== 0,
    'At least one page should be defined, see https://vike.dev/add'
  )
  if (viteIsSSR(config)) {
    const pageEntries = getPageEntries(pageConfigs)
    const entries = {
      // importBuild: resolve('dist/esm/node/importBuild.js'), // TODO/next-major-release: remove
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
  let clientFilePaths: string[] = []
  pageConfigs.forEach((pageConfig) => {
    const configValue = getConfigValue(pageConfig, 'clientRouting', 'boolean')
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
      const clientFilePath = getClientEntryFilePath(pageConfig)
      if (clientFilePath) {
        clientFilePaths.push(clientFilePath)
      }
    }
  })
  clientFilePaths = unique(clientFilePaths)
  clientFilePaths.forEach((pageFile) => {
    const { entryName, entryTarget } = getEntryFromFilePath(pageFile, config)
    clientEntries[entryName] = entryTarget
  })

  return { hasClientRouting, hasServerRouting, clientEntries }
}

// Ensure Rollup creates entries for each page file, see https://github.com/vikejs/vike/issues/350
// (Otherwise the page files may be missing in the client manifest.json)
async function getPageFileEntries(config: ResolvedConfig, includeAssetsImportedByServer: boolean) {
  const isForClientSide = !viteIsSSR(config)
  const fileTypes: FileType[] = isForClientSide ? ['.page', '.page.client'] : ['.page', '.page.server']

  let pageFiles = await findPageFiles(config, fileTypes, false)
  const pageFileEntries: Record<string, string> = {}
  pageFiles = unique(pageFiles)
  pageFiles.forEach((pageFile) => {
    const { entryName, entryTarget } = getEntryFromFilePath(pageFile, config)
    pageFileEntries[entryName] = entryTarget
  })
  return pageFileEntries
}

function getEntryFromFilePath(filePath: string, config: ResolvedConfig) {
  assertPosixPath(filePath)
  assert(filePath.startsWith('/'))

  let entryTarget = getFilePathAbsolute(filePath, config)

  let entryName = filePath
  entryName = removeFileExtention(entryName)
  entryName = prependEntriesDir(entryName)

  return { entryName, entryTarget }
}
function getEntryFromPageConfig(pageConfig: PageConfigBuildTime, isForClientSide: boolean) {
  let { pageId } = pageConfig
  const entryTarget = getVirtualFileIdPageConfigValuesAll(pageId, isForClientSide)
  let entryName = pageId
  entryName = prependEntriesDir(entryName)
  return { entryName, entryTarget }
}

function prependEntriesDir(entryName: string): string {
  if (entryName.startsWith('/')) {
    entryName = entryName.slice(1)
  }
  assert(!entryName.startsWith('/'))
  entryName = `entries/${entryName}`
  return entryName
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
