import type { Plugin, ResolvedConfig, UserConfig } from 'vite'
import type { InputOption } from 'rollup'
import { assert, getOutDir, isObject, isSSR_config } from '../utils'
import { modifyResolvedConfig } from '../utils/modifyResolvedConfig'
import { pageFileExtensions } from './generateImportGlobs/pageFileExtensions'
import path from 'path'
import glob from 'fast-glob'

export { buildConfig }

function buildConfig(): Plugin {
  return {
    name: 'vite-plugin-ssr:buildConfig',
    apply: 'build',
    async configResolved(config) {
      const input = {
        ...(await entryPoints(config)),
        ...normalizeRollupInput(config.build.rollupOptions.input),
      }
      modifyResolvedConfig(config, { build: { rollupOptions: { input } } })
    },
    config(config) {
      const configMod: UserConfig = {
        build: {
          outDir: getOutDir(config),
          manifest: !isSSR_config(config),
          // @ts-ignore
          polyfillDynamicImport: false,
        },
        //*
        // @ts-ignore
        ssr: { external: ['vite-plugin-ssr'] },
        /*/
        // Try Hydrogen's `noExternal: true` bundling strategy for Cloudflare Workers
        ssr: { noExternal: true },
        //*/
      }
      if (isSSR_config(config)) {
        configMod.publicDir = false
      }
      return configMod
    },
  }
}

async function entryPoints(config: ResolvedConfig): Promise<Record<string, string>> {
  const ssr = isSSR_config(config)
  const cwd = config.root
  const pageFiles = await glob(
    [`**/*.page.${pageFileExtensions}`, `**/*.page.${ssr ? 'server' : 'client'}.${pageFileExtensions}`],
    { ignore: ['**/node_modules/**'], cwd },
  )
  const pageFilesObject: Record<string, string> = {}
  pageFiles.forEach(
    (pageFile) => (pageFilesObject[removeFileExtention(pageFile)] = require.resolve(path.join(cwd, pageFile))),
  )
  if (ssr) {
    return {
      // We don't add the page files because it seems to be a breaking change for the internal Vite plugin `vite:dep-scan` (not sure why?). It then throws an error `No known conditions for "./server" entry in "react-streaming" package` where it previously didn't.
      // ...pageFilesObject,
      pageFiles: 'virtual:vite-plugin-ssr:pageFiles:server',
      importBuild: resolve('dist/cjs/node/importBuild.js'),
    }
  } else {
    return {
      // #350
      ...pageFilesObject,
      ['entry-client-routing']: resolve(`dist/esm/client/router/entry.js`),
      ['entry-server-routing']: resolve(`dist/esm/client/entry.js`),
    }
  }
}

function removeFileExtention(filePath: string) {
  return filePath.split('.').slice(0, -1).join('.')
}

function resolve(filePath: string) {
  assert(filePath.startsWith('dist/'))
  // Current directory: vite-plugin-ssr/dist/cjs/node/plugin/plugins/
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
