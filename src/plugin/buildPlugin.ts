import { assertPatch } from '@brillout/vite-fix-2390'
import { Plugin, UserConfig } from 'vite'
import {
  isAbsolute as pathIsAbsolute,
  relative as pathRelative,
  basename as pathFilename,
  sep as pathSep,
  posix as pathPosix
} from 'path'
import { assert } from '../utils'
import * as glob from 'fast-glob'
import { ssrConfig } from './ssrConfig'
import { isSSR } from './utils'

export { buildPlugin }

function buildPlugin(): Plugin {
  let isSsrBuild: boolean | undefined
  return {
    name: 'vite-plugin-ssr:build',
    apply: 'build',
    config: (config) => {
      isSsrBuild = isSSR(config)
      assertPatch()
      return {
        build: {
          outDir: getOutDir(config),
          manifest: true,
          rollupOptions: { input: entryPoints(config) },
          polyfillDynamicImport: false
        },
        ssr: ssrConfig
      }
    },
    transform: (_src, id) => {
      assert(isSsrBuild === true || isSsrBuild === false)
      return removeClientCode(isSsrBuild, id)
    }
  }
}

function removeClientCode(isSsrBuild: boolean, id: string) {
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
  const serverEntry = require.resolve('../user-files/infra.node.vite-entry')
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
