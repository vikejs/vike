export { buildConfig }

import type { Plugin } from 'vite'
import type { ResolvedConfig } from 'vite'
import { assert, determineOutDir, isObject, viteIsSSR, makeFilePathAbsolute, addOnBeforeLogHook } from '../utils'
import { findPageFiles } from '../helpers'
import { virtualModuleIdPageFilesServer } from './generateImportGlobs/virtualModuleIdPageFiles'
type InputOption = ResolvedConfig['build']['rollupOptions']['input'] // same as `import type { InputOption } from 'rollup'` but safe when Vite updates Rollup version

function buildConfig(): Plugin {
  return {
    name: 'vite-plugin-ssr:buildConfig',
    apply: 'build',
    enforce: 'post',
    async configResolved(config) {
      const input = {
        ...(await entryPoints(config)),
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

async function entryPoints(config: ResolvedConfig): Promise<Record<string, string>> {
  const ssr = viteIsSSR(config)
  const pageFiles = await findPageFiles(config, ssr ? ['.page', '.page.server'] : ['.page', '.page.client'])
  const pageFilesObject: Record<string, string> = {}
  pageFiles.forEach((p) => (pageFilesObject[removeFileExtention(p.slice(1))] = makeFilePathAbsolute(p, config)))
  if (ssr) {
    return {
      // We don't add the page files because it seems to be a breaking change for the internal Vite plugin `vite:dep-scan` (not sure why?). It then throws an error `No known conditions for "./server" entry in "react-streaming" package` where it previously didn't.
      // ...pageFilesObject,
      pageFiles: virtualModuleIdPageFilesServer,
      importBuild: resolve('dist/cjs/node/importBuild.js')
    }
  } else {
    return {
      // #350
      ...pageFilesObject,
      ['entry-client-routing']: resolve(`dist/esm/client/router/entry.js`),
      ['entry-server-routing']: resolve(`dist/esm/client/entry.js`)
    }
  }
}

function removeFileExtention(filePath: string) {
  return filePath.split('.').slice(0, -1).join('.')
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
