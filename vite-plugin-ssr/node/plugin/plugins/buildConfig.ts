import type { Plugin, UserConfig } from 'vite'
import type { InputOption } from 'rollup'
import { assert, getOutDir, isObject, isSSR_config } from '../utils'
import { assertViteConfig } from './config/assertConfig'

export { buildConfig }

function buildConfig(): Plugin {
  return {
    name: 'vite-plugin-ssr:buildConfig',
    apply: 'build',
    async config(config) {
      return {
        build: {
          outDir: getOutDir(config),
          manifest: !isSSR_config(config),
          rollupOptions: resolveRollupOptions(config),
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
    configResolved(c) {
      c.build.rollupOptions.output = {
        file: '/home/romuuu/.prog/files/code/vikepress/dist/client/pageFiles.js',
        //exports: 'named' as const
    }
    }
  }
}

function resolveRollupOptions(config: UserConfig) {
  assertViteConfig(config)
  if (config.vitePluginSsr.buildOnlyPageFiles) {
    return {
      /*
      input: {
        pageFiles: isSSR_config(config)
          ? 'virtual:vite-plugin-ssr:pageFiles:server'
          : 'virtual:vite-plugin-ssr:pageFiles:client',
      },
      */
      input:  'virtual:vite-plugin-ssr:pageFiles:client',
      output: {
        file: '/home/romuuu/.prog/files/code/vikepress/dist/client/pageFiles.js',
        //exports: 'named' as const
        /*
      external: ['pageFilesLazy'],
        format: 'iife' as const,
        name: 'MyBundle',
        globals: {
          pageFilesLazy: 'pageFilesLazy',
        },
        */
      },
    }
  }
  const input = {
    ...entryPoints(config),
    ...normalizeRollupInput(config.build?.rollupOptions?.input),
  }
  return { input }
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
