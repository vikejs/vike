import type { Plugin, UserConfig } from 'vite'
import type { InputOption } from 'rollup'
import { isAbsolute as pathIsAbsolute, relative as pathRelative, basename as pathFilename } from 'path'
import { assert, isObject } from '../utils'
import * as glob from 'fast-glob'
import { isSSR_config } from './utils'
import { getRoot } from './utils/getRoot'
import { getGlobPath } from './glob'

export { build }

function build(getGlobRoots: (root: string) => Promise<string[]>): Plugin {
  let isSsrBuild: boolean | undefined
  return {
    name: 'vite-plugin-ssr:build',
    apply: 'build',
    async config(config) {
      isSsrBuild = isSSR_config(config)
      const root = getRoot(config)
      const globRoots = await getGlobRoots(root)
      const input = {
        ...entryPoints(config, globRoots),
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
    transform: (_src, id) => {
      assert(isSsrBuild === true || isSsrBuild === false)
      return removeClientCode(isSsrBuild, id) || undefined
    },
  }
}

function removeClientCode(isSsrBuild: boolean, id: string): void | { code: string; map: { mappings: '' } } {
  if (!isSsrBuild) {
    return
  }
  if (id.includes('.page.client.')) {
    return {
      code: `throw new Error('[vite-plugin-ssr][Wrong Usage] File ${id} should not be loaded in Node.js');`,
      map: { mappings: '' },
    }
  }
}

function entryPoints(config: UserConfig, globRoots: string[]): Record<string, string> {
  if (isSSR_config(config)) {
    return serverEntryPoints()
  } else {
    return browserEntryPoints(config, globRoots)
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
  const entryName = pathFilename(filePath).replace(/\.js$/, '')
  const entryPoints = {
    [entryName]: filePath,
  }
  return entryPoints
}

function browserEntryPoints(config: UserConfig, globRoots: string[]): Record<string, string> {
  const root = getRoot(config)
  assert(pathIsAbsolute(root))

  const browserEntries: string[] = []
  globRoots.forEach((globRoot) => {
    const globPath = getGlobPath(globRoot, 'page.client', root)
    const ignore = globPath.includes('/node_modules/') ? [] : ['**/node_modules/**']
    const entries = glob.sync(globPath, { ignore })
    browserEntries.push(...entries)
  })

  const entryPoints: Record<string, string> = {}
  for (const filePath of browserEntries) {
    assert(pathIsAbsolute(filePath))
    let outFilePath = pathRelativeToRoot(filePath, config)
    outFilePath = outFilePath.split('../').join('_parent/')
    entryPoints[outFilePath] = filePath
  }

  /*
  Object.assign(entryPoints, getPageFilesEntry('dist/esm/client/page-files/pageFiles.js'))
  */

  return entryPoints
}

function pathRelativeToRoot(filePath: string, config: UserConfig): string {
  assert(pathIsAbsolute(filePath))
  const root = getRoot(config)
  assert(pathIsAbsolute(root))
  return pathRelative(root, filePath)
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
