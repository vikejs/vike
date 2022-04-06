import type { Plugin, UserConfig } from 'vite'
import type { InputOption } from 'rollup'
import path from 'path'
import { assert, isObject, isSSR_config } from '../utils'

export { build }

function build(): Plugin {
  return {
    name: 'vite-plugin-ssr:build',
    apply: 'build',
    async config(config) {
      const input = {
        ...entryPoints(config),
        ...normalizeRollupInput(config.build?.rollupOptions?.input),
      }
      return {
        build: {
          outDir: getOutDir(config),
          manifest: true,
          rollupOptions: { input },
          polyfillDynamicImport: false,
        },
        //*
        ssr: { external: ['vite-plugin-ssr'] },
        /*/
        // Try Hydrogen's `noExternal: true` bundling strategy for Cloudflare Workers
        ssr: { noExternal: true },
        //*/
      }
    },
  }
}

function entryPoints(config: UserConfig): Record<string, string> {
  if (isSSR_config(config)) {
    return {
      //pageFiles: resolve('dist/esm/node/page-files/pageFiles-node.js'),
      pageFiles: 'virtual:vite-plugin-ssr:pageFiles:server',
      importBuild: resolve('dist/cjs/node/importBuild.js')
    }
  } else {
    return {
      ['entry-client-routing']: resolve(`dist/esm/client/router/entry.js`),
      ['entry-server-routing']: resolve(`dist/esm/client/entry.js`),
    }
  }
}

function resolve(filePath: string) {
  assert(filePath.startsWith('dist/'))
  return require.resolve(`../../../../../${filePath}`)
}

function getOutDir(config: UserConfig): string {
  let outDir = config.build?.outDir
  if (!outDir) {
    outDir = 'dist'
  }
  outDir = path.posix.join(outDir, config.build?.ssr ? 'server' : 'client')
  return outDir
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
