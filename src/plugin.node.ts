import { Plugin, UserConfig } from 'vite'
import {
  isAbsolute as pathIsAbsolute,
  relative as pathRelative,
  basename as pathFilename,
  sep as pathSep,
  posix as pathPosix
} from 'path'
import { assert, assertUsage } from './utils/assert'
import * as glob from 'fast-glob'
import { workaroundViteIssue2390 } from './workaroundViteIssue2390'

export { plugin }

function plugin(): Plugin[] {
  const ssr = { external: ['vite-plugin-ssr'] }
  return [
    {
      name: 'vite-plugin-ssr[dev]',
      apply: 'serve',
      config: () => ({
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
      config: (config: UserConfig) => {
        workaroundViteIssue2390(getRoot(config))
        return {
          build: {
            outDir: getOutDir(config),
            manifest: !isSSR(config),
            rollupOptions: { input: entryPoints(config) },
            polyfillDynamicImport: false
          },
          ssr
        }
      }
    }
  ]
}

function entryPoints(config: UserConfig): Record<string, string> {
  if (isSSR(config)) {
    return serverEntryPoints()
  } else {
    return browserEntryPoints(config)
  }
}

function serverEntryPoints(): Record<string, string> {
  const serverEntry = require.resolve('./user-files/infra.node.vite-entry')
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
