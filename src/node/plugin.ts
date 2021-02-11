import { Plugin, UserConfig } from 'vite'
import {
  dirname as pathDirname,
  isAbsolute as pathIsAbsolute,
  join as pathJoin,
  relative as pathRelative,
  basename as pathFilename
} from 'path'
import { assert } from './utils/assert'
import * as glob from 'fast-glob'

export { plugin }

function plugin(): Plugin[] {
  return [
    {
      name: 'vite-plugin-ssr[dev]',
      apply: 'serve',
      config: () => ({
        alias: [aliasPluginImport()]
      })
    },
    {
      name: 'vite-plugin-ssr[build]',
      apply: 'build',
      config: (config: UserConfig) => ({
        build: {
          outDir: getOutDir(config),
          // manifest: true,
          rollupOptions: { input: entryPoints(config) }
        }
      })
    }
  ]
}

function aliasPluginImport() {
  const CLIENT_ENTRY = require.resolve(
    'vite-plugin-ssr/client/dist/client/index.js'
  )
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
  const ssr = !!config?.build?.ssr
  if (ssr) {
    return serverEntryPoints()
  } else {
    return browserEntryPoints(config)
  }
}

function serverEntryPoints(): Record<string, string> {
  const serverEntry = require.resolve('./findUserFiles.vite')
  const entryName = pathFilename(serverEntry).replace(/\.js$/, '')
  const entryPoints = {
    [entryName]: serverEntry
  }
  console.log(entryPoints)
  return entryPoints
}

function browserEntryPoints(config: UserConfig): Record<string, string> {
  const root = getRoot(config)
  assert(pathIsAbsolute(root))

  const distFiles = pathJoin(`${root}/`, `${getOutDir(config)}/`, '**')
  const browserEntries = glob.sync(`${root}/**/*.browser.*`, {
    ignore: ['**/node_modules/**', distFiles]
  })

  const entryPoints: Record<string, string> = {}
  for (const filePath of browserEntries) {
    assert(pathIsAbsolute(filePath))
    const outFilePath = pathRelativeToRoot(filePath, config)
    entryPoints[outFilePath] = filePath
  }
  console.log(entryPoints)
  return entryPoints
}

function pathRelativeToRoot(filePath: string, config: UserConfig): string {
  assert(pathIsAbsolute(filePath))
  const root = getRoot(config)
  assert(pathIsAbsolute(root))
  return pathRelative(root, filePath)
}

function getRoot(config: UserConfig): string {
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
