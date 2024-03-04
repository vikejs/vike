export { standalonePlugin }

import esbuild from 'esbuild'
import fs from 'fs/promises'
import path from 'path'
import { Plugin, searchForWorkspaceRoot } from 'vite'
import type { ConfigVikeNodeResolved } from '../../types.js'
import { assert, assertUsage } from '../../utils/assert.js'
import { toPosixPath } from '../utils/filesystemPathHandling.js'
import { getConfigVikeNode } from '../utils/getConfigVikeNode.js'
import { pLimit } from '../utils/pLimit.js'
import { unique } from '../utils/unique.js'

function standalonePlugin(): Plugin {
  let resolvedConfig: ConfigVikeNodeResolved
  let enabled = false

  let root = ''
  let outDir = ''
  let outDirAbs = ''
  let rollupEntryFilePaths: string[]
  let rollupResolve: any

  // Support Nestjs
  // https://github.com/nestjs/nest-cli/blob/edbd64d1eb186c49c28b7594e5d8269a5b125385/lib/compiler/defaults/webpack-defaults.ts#L69
  const lazyNpmImports = [
    '@nestjs/microservices',
    '@nestjs/websockets',
    'cache-manager',
    'class-validator',
    'class-transformer'
  ]

  return {
    name: 'vike-node:standalone',
    apply(_, env) {
      return !!env.isSsrBuild
    },
    async configResolved(config) {
      resolvedConfig = getConfigVikeNode(config)
      assert(typeof resolvedConfig.server.standalone === 'boolean')
      enabled = resolvedConfig.server.standalone
      if (!enabled) return
      root = toPosixPath(config.root)
      outDir = toPosixPath(config.build.outDir)
      outDirAbs = path.posix.join(root, outDir)
    },
    buildStart() {
      if (!enabled) return
      rollupResolve = this.resolve.bind(this)
    },
    writeBundle(_, bundle) {
      if (!enabled) return
      const entries = findRollupBundleEntries(bundle, resolvedConfig, root)
      rollupEntryFilePaths = entries.map((e) => path.posix.join(outDirAbs, e.fileName))
    },
    // closeBundle() + `enforce: 'post'` in order to start the final build step as late as possible
    enforce: 'post',
    async closeBundle() {
      if (!enabled) return
      const base = toPosixPath(searchForWorkspaceRoot(root))
      const relativeRoot = path.posix.relative(base, root)
      const relativeOutDir = path.posix.join(relativeRoot, outDir)

      const res = await esbuild.build({
        platform: 'node',
        format: 'esm',
        bundle: true,
        external: resolvedConfig.server.native,
        entryPoints: rollupEntryFilePaths,
        // .mjs set in getEntryFileName
        outExtension: { '.js': '.mjs' },
        splitting: rollupEntryFilePaths.length > 1,
        outdir: outDirAbs,
        allowOverwrite: true,
        metafile: true,
        logOverride: {
          // TODO: ignore the warning, or include the import?
          // rollup includes the import even if "sideEffects": false
          // esbuild doesn't include the import and prints a warning instead
          'ignored-bare-import': 'silent'
        },
        banner: {
          js: [
            "import { dirname as dirname987 } from 'path';",
            "import { fileURLToPath as fileURLToPath987 } from 'url';",
            "import { createRequire as createRequire987 } from 'module';",
            'var require = createRequire987(import.meta.url);',
            'var __filename = fileURLToPath987(import.meta.url);',
            'var __dirname = dirname987(__filename);'
          ].join('\n')
        },
        plugins: [
          {
            name: 'standalone-ignore',
            setup(build) {
              build.onResolve({ filter: /.*/, namespace: 'ignore' }, (args) => ({
                path: args.path,
                namespace: 'ignore'
              }))
              build.onResolve({ filter: new RegExp(`^(${lazyNpmImports.join('|')})`) }, async (args) => {
                const resolved = await rollupResolve(args.path)
                // if the package is not installed, ignore the import
                // if the package is installed, try to bundle it
                if (!resolved) {
                  return {
                    path: args.path,
                    namespace: 'ignore'
                  }
                }
              })
              build.onLoad({ filter: /.*/, namespace: 'ignore' }, () => ({
                contents: ''
              }))
            }
          }
        ]
      })
      // The inputs of the bundled files are safe to remove from the outDir folder
      const bundledFilesFromOutDir = Object.keys(res.metafile.inputs).filter(
        (relativeFile) =>
          !rollupEntryFilePaths.some((entryFilePath) => entryFilePath.endsWith(relativeFile)) &&
          relativeFile.startsWith(outDir)
      )
      for (const relativeFile of bundledFilesFromOutDir) {
        await fs.rm(path.posix.join(root, relativeFile))
      }
      // Remove leftover empty dirs
      const relativeDirs = unique(bundledFilesFromOutDir.map((file) => path.dirname(file)))
      for (const relativeDir of relativeDirs) {
        const absDir = path.posix.join(root, relativeDir)
        const files = await fs.readdir(absDir)
        if (!files.length) {
          await fs.rm(absDir, { recursive: true })
        }
      }
      const { nodeFileTrace } = await import('@vercel/nft')
      const result = await nodeFileTrace(rollupEntryFilePaths, {
        base
      })

      const tracedDeps = new Set<string>()
      for (const file of result.fileList) {
        if (result.reasons.get(file)?.type.includes('initial')) {
          continue
        }
        tracedDeps.add(toPosixPath(file))
      }

      const files = [...tracedDeps].filter(
        (path) =>
          !path.startsWith(relativeOutDir) &&
          // false detection
          !path.startsWith('usr/')
      )

      // We are done, no dependencies need to be copied
      if (!files.length) {
        return
      }

      if (result.warnings.size && isYarnPnP()) {
        // TODO: assert the warning is caused by a native dependency
        assertUsage(false, 'Standalone build is not supported when using Yarn PnP and native dependencies.')
      }

      // this is only needed if searchForWorkspaceRoot doesn't find the workspace root and returns the fs root
      // this is very unlikely, but possible
      // to test this, set base to '/' and it should still work
      const commonAncestor = findCommonAncestor(files)

      const concurrencyLimit = pLimit(10)
      const copiedFiles = new Set<string>()
      await Promise.all(
        files.map((relativeFile) =>
          concurrencyLimit(async () => {
            const tracedFilePath = path.posix.join(base, relativeFile)
            const isNodeModules = relativeFile.includes('node_modules')

            relativeFile = relativeFile.replace(relativeRoot, '').replace(commonAncestor, '')
            const relativeFileHoisted = `node_modules${relativeFile.split('node_modules').pop()}`
            const fileOutputPath = path.posix.join(outDirAbs, isNodeModules ? relativeFileHoisted : relativeFile)
            const isDir = (await fs.stat(tracedFilePath)).isDirectory()

            if (!isDir && !copiedFiles.has(fileOutputPath)) {
              copiedFiles.add(fileOutputPath)
              await fs.cp(await fs.realpath(tracedFilePath), fileOutputPath, {
                recursive: true
              })
            }
          })
        )
      )
    }
  }
}

function findCommonAncestor(paths: string[]) {
  // There is no common anchestor of 0 or 1 path
  if (paths.length <= 1) {
    return ''
  }

  // Split each path into its components
  const pathsComponents = paths.map((path) => path.split('/'))

  let commonAncestor = ''
  let index = 0

  assert(pathsComponents.length)

  // While there is a common component at the current index
  while (pathsComponents.every((components) => components[index] === pathsComponents[0]![index])) {
    // Add the common component to the common ancestor path
    commonAncestor += pathsComponents[0]![index] + '/'
    index++
  }

  // If no common ancestor was found, return an empty string
  if (commonAncestor === '') {
    return ''
  }

  // Otherwise, return the common ancestor path, removing the trailing slash
  return commonAncestor.slice(0, -1)
}

function isYarnPnP(): boolean {
  try {
    require('pnpapi')
    return true
  } catch {
    return false
  }
}

function findRollupBundleEntries<OutputBundle extends Record<string, { name: string | undefined }>>(
  bundle: OutputBundle,
  resolvedConfig: ConfigVikeNodeResolved,
  root: string
): OutputBundle[string][] {
  const entryPathsFromConfig = Object.values(resolvedConfig.server.entry).map((entryPath) =>
    path.posix.join(root, entryPath)
  )
  const entries: OutputBundle[string][] = []

  for (const key in bundle) {
    const entry = bundle[key]!
    // https://github.com/brillout/vite-plugin-ssr/issues/612
    if (!('facadeModuleId' in entry) || key.endsWith('.map') || key.endsWith('.json')) continue
    assert(entry.facadeModuleId === null || typeof entry.facadeModuleId === 'string')
    if (entry.facadeModuleId && entryPathsFromConfig.includes(entry.facadeModuleId)) {
      entries.push(entry)
    }
  }
  const serverIndex = entries.find((e) => e.name === 'index')
  assert(serverIndex)

  // bundle the index entry first
  return entries.sort((a, b) => {
    const isIndexA = a.name === 'index'
    const isIndexB = a.name === 'index'

    if (isIndexA) {
      return -1
    }

    if (isIndexB) {
      return 1
    }

    return 0
  })
}
