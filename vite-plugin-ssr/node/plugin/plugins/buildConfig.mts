export { buildConfig }
export { assertRollupInput }

import {
  assert,
  resolveOutDir,
  isObject,
  viteIsSSR,
  getFilePathAbsolute,
  addOnBeforeLogHook,
  removeFileExtention,
  unique,
  assertPosixPath,
  assertUsage
} from '../utils.mjs'
import { virtualFileIdImportUserCodeServer } from '../../shared/virtual-files/virtualFileImportUserCode.mjs'
import { getVikeConfig } from './importUserCode/v1-design/getVikeConfig.mjs'
import { getCodeFilePath, getConfigValue } from '../../../shared/page-configs/utils.mjs'
import { findPageFiles } from '../shared/findPageFiles.mjs'
import { getConfigVps } from '../../shared/getConfigVps.mjs'
import type { ResolvedConfig, Plugin, Rollup, UserConfig } from 'vite'
import { getVirtualFileIdImportPageCode } from '../../shared/virtual-files/virtualFileImportPageCode.mjs'
import type { PageConfigData } from '../../../shared/page-configs/PageConfig.mjs'
import type { FileType } from '../../../shared/getPageFiles/fileTypes.mjs'
import { extractAssetsAddQuery } from '../../shared/extractAssetsQuery.mjs'
type InputOption = Rollup.InputOption
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

function buildConfig(): Plugin {
  return {
    name: 'vite-plugin-ssr:buildConfig',
    apply: 'build',
    enforce: 'post',
    configResolved: {
      order: 'post',
      async handler(config) {
        assertRollupInput(config)
        const userInputs = normalizeRollupInput(config.build.rollupOptions.input)
        const entries = await getEntries(config)
        assert(Object.keys(entries).length > 0)
        const input = {
          ...entries,
          ...userInputs
        }
        config.build.rollupOptions.input = input
        addLogHook()
      }
    },
    config(config) {
      return {
        build: {
          outDir: resolveOutDir(config),
          manifest: !viteIsSSR(config),
          copyPublicDir: !viteIsSSR(config)
        }
      } satisfies UserConfig
    }
  }
}

async function getEntries(config: ResolvedConfig): Promise<Record<string, string>> {
  const configVps = await getConfigVps(config)
  const pageFileEntries = await getPageFileEntries(config, configVps.includeAssetsImportedByServer) // TODO/v1-release: remove
  const { pageConfigsData } = await getVikeConfig(config.root, false, configVps.extensions)
  assertUsage(
    Object.keys(pageFileEntries).length !== 0 || pageConfigsData.length !== 0,
    'At least one page should be defined, see https://vite-plugin-ssr.com/add'
  )
  if (viteIsSSR(config)) {
    const serverEntries = analyzeServerEntries(pageConfigsData)
    const entries = {
      pageFiles: virtualFileIdImportUserCodeServer, // TODO/next-major-release: rename to configFiles
      importBuild: resolve('dist/node/importBuild.mjs'), // TODO/next-major-release: remove
      ...pageFileEntries,
      ...serverEntries
    }
    return entries
  } else {
    let { hasClientRouting, hasServerRouting, clientEntries } = analyzeClientEntries(pageConfigsData, config)
    if (Object.entries(pageFileEntries).length > 0) {
      hasClientRouting = true
      hasServerRouting = true
    }
    const entries: Record<string, string> = {
      ...clientEntries,
      ...pageFileEntries
    }
    const clientRoutingEntry = resolve(`dist/client/client-routing-runtime/entry.mjs`)
    const serverRoutingEntry = resolve(`dist/client/server-routing-runtime/entry.mjs`)
    if (hasClientRouting) {
      entries['entries/entry-client-routing'] = clientRoutingEntry
    }
    if (hasServerRouting) {
      entries['entries/entry-server-routing'] = serverRoutingEntry
    }
    return entries
  }
}

function analyzeClientEntries(pageConfigsData: PageConfigData[], config: ResolvedConfig) {
  let hasClientRouting = false
  let hasServerRouting = false
  let clientEntries: Record<string, string> = {}
  let clientFilePaths: string[] = []
  pageConfigsData.forEach((pageConfigData) => {
    const clientRouting = getConfigValue(pageConfigData, 'clientRouting', 'boolean')
    if (clientRouting) {
      hasClientRouting = true
    } else {
      hasServerRouting = true
    }
    {
      const { entryName, entryTarget } = getEntryFromPageConfigData(pageConfigData, true)
      clientEntries[entryName] = entryTarget
    }
    {
      const clientFilePath = getCodeFilePath(pageConfigData, 'client')
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
function analyzeServerEntries(pageConfigsData: PageConfigData[]) {
  const serverEntries: Record<string, string> = {}
  pageConfigsData.forEach((pageConfigData) => {
    const { entryName, entryTarget } = getEntryFromPageConfigData(pageConfigData, false)
    serverEntries[entryName] = entryTarget
  })
  return serverEntries
}

// Ensure Rollup creates entries for each page file, see https://github.com/brillout/vite-plugin-ssr/issues/350
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
    const { entryName, entryTarget } = getEntryFromFilePath(pageFile, config, addExtractAssetsQuery)
    pageFileEntries[entryName] = entryTarget
  })
  return pageFileEntries
}

function getEntryFromFilePath(filePath: string, config: ResolvedConfig, addExtractAssetsQuery?: boolean) {
  assertPosixPath(filePath)
  assert(filePath.startsWith('/'))

  let entryTarget = getFilePathAbsolute(filePath, config)
  if (addExtractAssetsQuery) entryTarget = extractAssetsAddQuery(entryTarget)

  let entryName = filePath
  if (addExtractAssetsQuery) entryName = extractAssetsAddQuery(entryName)
  entryName = removeFileExtention(entryName)
  entryName = prependEntriesDir(entryName)

  return { entryName, entryTarget }
}
function getEntryFromPageConfigData(pageConfigData: PageConfigData, isForClientSide: boolean) {
  let { pageId } = pageConfigData
  const entryTarget = getVirtualFileIdImportPageCode(pageId, isForClientSide)
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
  // [RELATIVE_PATH_FROM_DIST] Current directory: node_modules/vite-plugin-ssr/dist/node/plugin/plugins/
  return require.resolve(`../../../../../${filePath}`)
}

function normalizeRollupInput(input?: InputOption): Record<string, string> {
  if (!input) {
    return {}
  }
  // Usually `input` is an oject, but the user can set it as a `string` or `string[]`
  if (typeof input === 'string') {
    input = [input]
  }
  if (Array.isArray(input)) {
    return Object.fromEntries(input.map((input) => [input, input]))
  }
  assert(isObject(input))
  return input
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
    `The entry ${htmlInput} of config build.rollupOptions.input is an HTML entry which is forbidden when using vite-plugin-ssr, instead follow https://vite-plugin-ssr.com/add`
  )
}
