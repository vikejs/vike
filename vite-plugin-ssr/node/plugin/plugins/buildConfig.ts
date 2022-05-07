import type { Plugin, UserConfig } from 'vite'
import type { InputOption } from 'rollup'
import { assert, getOutDir, isObject, isSSR_config } from '../utils'

export { buildConfig }

function buildConfig(): Plugin {
  return {
    name: 'vite-plugin-ssr:buildConfig',
    apply: 'build',
    async config(config) {
      const input = {
        ...entryPoints(config),
        ...normalizeRollupInput(config.build?.rollupOptions?.input),
      }
      return {
        build: {
          outDir: getOutDir(config),
          manifest: !isSSR_config(config),
          rollupOptions: { input },
          // @ts-ignore
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
      pageFiles: 'virtual:vite-plugin-ssr:pageFiles:server',
      importBuild: resolve('dist/cjs/node/importBuild.js'),
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
