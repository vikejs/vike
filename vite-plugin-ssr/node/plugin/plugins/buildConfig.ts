export { buildConfig }

import type { Plugin } from 'vite'
import type { InputOption } from 'rollup'
import type { ResolvedConfig } from 'vite'
import { assert, determineOutDir, isObject, viteIsSSR, makeFilePathAbsolute } from '../utils'
import { modifyResolvedConfig, findPageFiles } from '../helpers'
import { virtualModuleIdPageFilesServer } from './generateImportGlobs/virtualModuleIdPageFiles'

function buildConfig(): Plugin {
  return {
    name: 'vite-plugin-ssr:buildConfig',
    apply: 'build',
    async configResolved(config) {
      const input = {
        ...(await entryPoints(config)),
        ...normalizeRollupInput(config.build.rollupOptions.input)
      }
      modifyResolvedConfig(config, { build: { rollupOptions: { input } } })
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
