import type { Plugin, UserConfig } from 'vite'
import type { InputOption } from 'rollup'
import { basename } from 'path'
import { assert, isObject } from '../utils'
import { isSSR_config } from './utils'

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
    return serverEntryPoints()
  } else {
    return browserEntryPoints()
  }
}

function serverEntryPoints(): Record<string, string> {
  return getPageFilesEntry('dist/esm/node/page-files/pageFiles.js')
}

function getPageFilesEntry(
  filePathRelative: 'dist/esm/node/page-files/pageFiles.js' | 'dist/esm/client/page-files/pageFiles.js',
): Record<string, string> {
  // Current directory: vite-plugin-ssr/dist/cjs/node/plugin/
  const filePath = require.resolve(`../../../../${filePathRelative}`)
  assert(filePath.endsWith('.js'))
  const entryName = basename(filePath).replace(/\.js$/, '')
  const entryPoints = {
    [entryName]: filePath,
  }
  return entryPoints
}

function browserEntryPoints(): Record<string, string> {
  // Current directory: vite-plugin-ssr/dist/cjs/node/plugin/
  const entryPoints = {
    ['entry-client-routing']: require.resolve(`../../../../dist/esm/client/router/entry.js`),
    ['entry-server-routing']: require.resolve(`../../../../dist/esm/client/entry.js`),
  }
  return entryPoints
}

function getOutDir(config: UserConfig): string {
  let outDir = config.build?.outDir
  if (!outDir) {
    outDir = 'dist'
  }
  return config.build?.ssr ? `${outDir}/server` : `${outDir}/client`
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
