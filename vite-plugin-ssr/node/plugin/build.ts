import { Plugin, UserConfig } from 'vite'
import type { InputOption } from 'rollup'
import {
  isAbsolute as pathIsAbsolute,
  relative as pathRelative,
  basename as pathFilename,
  sep as pathSep,
  posix as pathPosix
} from 'path'
import { assert, isObject } from '../../shared/utils'
import * as glob from 'fast-glob'

export { build }

function build(): Plugin {
  let isSsrBuild: boolean | undefined
  return {
    name: 'vite-plugin-ssr:build',
    apply: 'build',
    config: (config) => {
      isSsrBuild = isSSR(config)
      const input = {
        ...entryPoints(config),
        ...normalizeRollupInput(config.build?.rollupOptions?.input)
      }
      return {
        build: {
          outDir: getOutDir(config),
          manifest: true,
          rollupOptions: { input },
          polyfillDynamicImport: false
        },
        ssr: { external: ['vite-plugin-ssr'] }
      }
    },
    transform: (_src, id) => {
      assert(isSsrBuild === true || isSsrBuild === false)
      return removeClientCode(isSsrBuild, id) || undefined
    }
  }
}

function removeClientCode(isSsrBuild: boolean, id: string): void | { code: string; map: null } {
  if (!isSsrBuild) {
    return
  }
  if (id.includes('.page.client.')) {
    return {
      code: `throw new Error('[vite-plugin-ssr][Wrong Usage] File ${id} should not be loaded in Node.js');`,
      map: null
    }
  }
}

function entryPoints(config: UserConfig): Record<string, string> {
  if (isSSR(config)) {
    return serverEntryPoints()
  } else {
    return browserEntryPoints(config)
  }
}

function serverEntryPoints(): Record<string, string> {
  // Current directory: vite-plugin-ssr/dist/cjs/node/plugin/
  const serverEntry = require.resolve('../../../../dist/esm/node/page-files/pageFiles.js')
  assert(serverEntry.endsWith('.js'))
  const entryName = pathFilename(serverEntry).replace(/\.js$/, '')
  const entryPoints = {
    [entryName]: serverEntry
  }
  return entryPoints
}

function browserEntryPoints(config: UserConfig): Record<string, string> {
  const root = getRoot(config)
  assert(pathIsAbsolute(root))

  const browserEntries = glob.sync(`${root}/**/*.page.client.*([a-zA-Z0-9])`, {
    ignore: ['**/node_modules/**']
  })

  const entryPoints: Record<string, string> = {}
  for (const filePath of browserEntries) {
    assert(pathIsAbsolute(filePath))
    const outFilePath = pathRelativeToRoot(filePath, config)
    entryPoints[outFilePath] = filePath
  }
  return entryPoints
}

function pathRelativeToRoot(filePath: string, config: UserConfig): string {
  assert(pathIsAbsolute(filePath))
  const root = getRoot(config)
  assert(pathIsAbsolute(root))
  return pathRelative(root, filePath)
}

function getRoot(config: UserConfig): string {
  let root = config.root || process.cwd()
  assert(pathIsAbsolute(root))
  root = posixPath(root)
  return root
}

function getOutDir(config: UserConfig): string {
  let outDir = config.build?.outDir
  if (!outDir) {
    outDir = config.build?.ssr ? 'dist/server' : 'dist/client'
  }
  return outDir
}

function posixPath(path: string): string {
  return path.split(pathSep).join(pathPosix.sep)
}

function isSSR(config: { build?: { ssr?: boolean | string } }): boolean {
  return !!config?.build?.ssr
}

function normalizeRollupInput(input?: InputOption): Record<string, string> {
  if (!input) {
    return {}
  }
  /*
  if (typeof input === "string") {
    return { [input]: input };
  }
  if (Array.isArray(input)) {
    return Object.fromEntries(input.map((i) => [i, i]));
  }
  */
  assert(isObject(input))
  return input
}
