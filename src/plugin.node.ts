import { Plugin, UserConfig } from 'vite'
import {
  dirname as pathDirname,
  isAbsolute as pathIsAbsolute,
  relative as pathRelative,
  basename as pathFilename,
  sep as pathSep,
  posix as pathPosix
} from 'path'
import { assert, assertUsage } from './utils/assert'
import * as glob from 'fast-glob'
const CLIENT_ENTRY = require.resolve('vite-plugin-ssr/dist/client.js')
const SERVER_ENTRY = require.resolve('./user-files/infra.node.vite-entry')

export { plugin }

function plugin(): Plugin[] {
  const ssr = { external: ['vite-plugin-ssr'] }
  return [
    {
      name: 'vite-plugin-ssr[dev]',
      apply: 'serve',
      config: () => ({
        resolve: {
          alias: [aliasPluginImport()]
        },
        ssr,
        optimizeDeps: {
          entries: [
            '**/*.page.*([a-zA-Z0-9])',
            '**/*.page.client.*([a-zA-Z0-9])'
          ]
        }
      })
    },
    {
      name: 'vite-plugin-ssr[build]',
      apply: 'build',
      config: (config: UserConfig) => ({
        build: {
          outDir: getOutDir(config),
          manifest: !isSSR(config),
          rollupOptions: { input: entryPoints(config) },
          polyfillDynamicImport: false
        },
        ssr
      })
    }
  ]
}

function aliasPluginImport() {
  const CLIENT_DIR = pathDirname(CLIENT_ENTRY)

  // CLIENT_DIR may contain $$ which cannot be used as direct replacement
  // string, see https://github.com/vitejs/vite/issues/1732
  const replacement = () => CLIENT_DIR + '/'

  return {
    find: /^\/@vite-plugin-ssr\/client\//,
    // Fix Rollup's incorrect type declaration
    replacement: (replacement as unknown) as string
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
  const entryName = pathFilename(SERVER_ENTRY).replace(/\.js$/, '')
  const entryPoints = {
    [entryName]: SERVER_ENTRY
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

function isSSR(config: UserConfig): boolean {
  return !!config?.build?.ssr
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

Object.defineProperty(plugin, 'apply', {
  enumerable: true,
  get: () => {
    assertUsage(
      false,
      'Make sure to instantiate the `ssr` plugin (`import ssr from "vite-plugin-ssr"`): include `ssr()` instead of `ssr` in the `plugins` list of your `vite.config.js`.'
    )
  }
})
