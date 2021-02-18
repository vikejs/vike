import { Plugin, UserConfig } from 'vite'
import {
  dirname as pathDirname,
  isAbsolute as pathIsAbsolute,
  relative as pathRelative,
  basename as pathFilename
} from 'path'
import { assert } from './utils/assert'
import * as glob from 'fast-glob'
const CLIENT_ENTRY = require.resolve('vite-plugin-ssr/dist/client.js')
const SERVER_ENTRY = require.resolve('./user-files/infra.vite')

export { plugin }

function plugin(): Plugin[] {
  return [
    {
      name: 'vite-plugin-ssr[dev]',
      apply: 'serve',
      config: () => ({
        resolve: {
          alias: [aliasPluginImport()]
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
          rollupOptions: { input: entryPoints(config) }
        }
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
  function getRoot(config: UserConfig): string {
    const root = config.root || process.cwd()
    assert(pathIsAbsolute(root))
    return root
  }
  const root = config.root || process.cwd()
  assert(pathIsAbsolute(root))
  return root
}

function getOutDir(config: UserConfig): string {
  let outDir = config.build?.outDir
  if (!outDir) {
    outDir = config.build?.ssr ? 'dist/server' : 'dist/client'
  }
  return outDir
}
