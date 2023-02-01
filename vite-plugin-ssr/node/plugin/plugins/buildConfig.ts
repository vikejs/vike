export { buildConfig }

import type { Plugin } from 'vite'
import type { ResolvedConfig } from 'vite'
import {
  assert,
  determineOutDir,
  isObject,
  viteIsSSR,
  makeFilePathAbsolute,
  addOnBeforeLogHook,
  removeFileExtention
} from '../utils'
import { findPageFiles } from '../helpers'
import { virtualModuleIdPageFilesServer } from './virtualFiles/virtualModuleIdPageFiles'
import { getPageConfigsData } from './virtualFiles/generatePageConfigsSourceCode/getPageConfigsData'
import { handleBuildError } from './virtualFiles/generatePageConfigsSourceCode/handleBuildError'
import { loadPageConfigFiles } from './virtualFiles/generatePageConfigsSourceCode/loadPageConfigFiles'
import { getConfigValue } from '../../../shared/page-configs/utils'
type InputOption = ResolvedConfig['build']['rollupOptions']['input'] // same as `import type { InputOption } from 'rollup'` but safe when Vite updates Rollup version

function buildConfig(): Plugin {
  return {
    name: 'vite-plugin-ssr:buildConfig',
    apply: 'build',
    enforce: 'post',
    async configResolved(config) {
      const input = {
        ...(await getEntries(config)),
        ...normalizeRollupInput(config.build.rollupOptions.input)
      }
      config.build.rollupOptions.input = input
      addLogHook()
    },
    config(config) {
      return {
        build: {
          outDir: determineOutDir(config),
          manifest: !viteIsSSR(config),
          polyfillDynamicImport: false
        },
        ssr: { external: ['vite-plugin-ssr'] }
        /* We cannot do this because of https://github.com/brillout/vite-plugin-ssr/issues/447
        plublicDir: !viteIsSSR(config),
        */
      }
    }
  }
}

async function getEntries(config: ResolvedConfig): Promise<Record<string, string>> {
  const pageFileEntries = await getPageFileEntries(config) // TODO/v1-release: remove
  let { hasClientRouting, hasServerRouting } = await analyzeAppRouting(config)
  if (Object.entries(pageFileEntries).length > 0) {
    hasClientRouting = true
    hasServerRouting = true
  }
  assert(hasClientRouting || hasServerRouting)
  if (viteIsSSR(config)) {
    return {
      // We don't add the page files because it seems to be a breaking change for the internal Vite plugin `vite:dep-scan` (not sure why?). It then throws an error `No known conditions for "./server" entry in "react-streaming" package` where it previously didn't.
      // ...pageFileEntries,
      pageFiles: virtualModuleIdPageFilesServer, // TODO/next-major-release: rename to pageConfigFiles
      importBuild: resolve('dist/cjs/node/importBuild.js')
    }
  } else {
    const entries = {
      ...pageFileEntries
    }
    const clientRoutingEntry = resolve(`dist/esm/client/router/entry.js`)
    const serverRoutingEntry = resolve(`dist/esm/client/entry.js`)
    if (hasClientRouting) {
      entries['entry-client-routing'] = clientRoutingEntry
    }
    if (hasServerRouting) {
      entries['entry-server-routing'] = serverRoutingEntry
    }
    return entries
  }
}

async function analyzeAppRouting(config: ResolvedConfig) {
  const userRootDir = config.root
  const result = await loadPageConfigFiles(userRootDir)
  if ('err' in result) {
    handleBuildError(result.err, false)
    assert(false)
  }
  const { pageConfigFiles } = result
  const { pageConfigsData } = getPageConfigsData(pageConfigFiles, userRootDir)

  let hasClientRouting = false
  let hasServerRouting = false
  pageConfigsData.forEach((pageConfigData) => {
    const clientRouting = getConfigValue(pageConfigData, 'clientRouting', 'boolean')
    if (clientRouting) {
      hasClientRouting = true
    } else {
      hasServerRouting = true
    }
  })
  return { hasClientRouting, hasServerRouting }
}

// Ensure Rollup creates entries for each page file, see https://github.com/brillout/vite-plugin-ssr/issues/350
// (Ohterwise the page files may be missing in the client manifest.json)
async function getPageFileEntries(config: ResolvedConfig) {
  const ssr = viteIsSSR(config)
  const pageFiles = await findPageFiles(config, ssr ? ['.page', '.page.server'] : ['.page', '.page.client'])
  const pageFileEntries: Record<string, string> = {}
  pageFiles.forEach((p) => (pageFileEntries[removeFileExtention(p.slice(1))] = makeFilePathAbsolute(p, config)))
  return pageFileEntries
}

function resolve(filePath: string) {
  assert(filePath.startsWith('dist/'))
  // [RELATIVE_PATH_FROM_DIST] Current directory: node_modules/vite-plugin-ssr/dist/cjs/node/plugin/plugins/
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
