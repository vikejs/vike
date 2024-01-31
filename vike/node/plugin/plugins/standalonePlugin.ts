export { standalonePlugin }

import esbuild from 'esbuild'
import fs from 'fs/promises'
import path from 'path'
import { Plugin, searchForWorkspaceRoot } from 'vite'
import { pLimit } from '../../../utils/pLimit.js'
import { assert, assertUsage, toPosixPath, unique } from '../utils.js'
import { getConfigVike } from '../../shared/getConfigVike.js'

function standalonePlugin(): Plugin {
  let root = ''
  let distDir = ''
  let outDir = ''
  let outDirAbs = ''
  let serverIndexFilePath: string

  // Native dependencies always need to be esbuild external
  let native: string[] = []
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
    name: 'vike:standalone',
    apply(config, env) {
      //@ts-expect-error Vite 5 || Vite 4
      return !!(env.isSsrBuild || env.ssrBuild)
    },
    config(config, env) {
      return {
        ssr: {
          // esbuild warning:
          // noExternal: [noExternalRegex]
          //   ▲ [WARNING] Ignoring this import because "../../node_modules/.pnpm/@brillout+picocolors@1.0.10/node_modules/@brillout/picocolors/picocolors.js" was marked as having no side effects [ignored-bare-import]

          //   dist/server/entries/pages_about.mjs:6:7:
          //     6 │ import "@brillout/picocolors";
          //       ╵        ~~~~~~~~~~~~~~~~~~~~~~

          // "sideEffects" is false in the enclosing "package.json" file:

          //   ../../node_modules/@brillout/picocolors/package.json:10:2:
          //     10 │   "sideEffects": false,
          noExternal: ['@brillout/picocolors']
        }
      }
    },
    async configResolved(config) {
      const configVike = await getConfigVike(config)
      native = configVike.native
      root = toPosixPath(config.root)
      outDir = toPosixPath(config.build.outDir)
      distDir = outDir.split('/')[0]!
      outDirAbs = path.posix.join(root, outDir)
    },
    buildStart() {
      rollupResolve = this.resolve.bind(this)
    },
    writeBundle(_, bundle) {
      const serverIndex = findRollupBundleEntry('index', bundle)
      assert(serverIndex)
      const serverIndexFileName = serverIndex.fileName
      serverIndexFilePath = path.posix.join(outDirAbs, serverIndexFileName)
    },
    // closeBundle() + `enforce: 'post'` in order to start the final build step as late as possible
    enforce: 'post',
    async closeBundle() {
      const res = await esbuild.build({
        platform: 'node',
        format: 'esm',
        bundle: true,
        external: native,
        entryPoints: { index: serverIndexFilePath },
        outfile: serverIndexFilePath,
        allowOverwrite: true,
        metafile: true,
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

      // The inputs of the bundled files are safe to remove
      const filesToRemove = Object.keys(res.metafile.inputs).filter(
        (relativeFile) => !serverIndexFilePath.endsWith(relativeFile) && relativeFile.startsWith(distDir)
      )
      for (const relativeFile of filesToRemove) {
        await fs.rm(path.posix.join(root, relativeFile))
      }

      // Remove leftover empty dirs
      const relativeDirs = unique(filesToRemove.map((file) => path.dirname(file)))
      for (const relativeDir of relativeDirs) {
        const absDir = path.posix.join(root, relativeDir)
        const files = await fs.readdir(absDir)
        if (!files.length) {
          await fs.rm(absDir, { recursive: true })
        }
      }

      const base = toPosixPath(searchForWorkspaceRoot(root))
      const relativeRoot = path.posix.relative(base, root)
      const relativeDistDir = path.posix.relative(base, distDir)

      const { nodeFileTrace } = await import('@vercel/nft')
      const result = await nodeFileTrace([serverIndexFilePath], {
        base
      })

      const tracedDeps = new Set<string>()
      for (const file of result.fileList) {
        if (result.reasons.get(file)?.type.includes('initial')) {
          continue
        }
        tracedDeps.add(toPosixPath(file))
      }

      const files = [...tracedDeps].filter((path) => !path.startsWith(relativeDistDir) && !path.startsWith('usr/'))

      // We are done, no native dependencies need to be copied
      if (!files.length) {
        return
      }

      if (result.warnings.size && isYarnPnP()) {
        assertUsage(false, 'Standalone build is not supported when using Yarn PnP and native dependencies.')
      }

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
              await fs.cp(await fs.realpath(tracedFilePath), fileOutputPath, { recursive: true })
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

  assert(pathsComponents.length, { paths })

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

function findRollupBundleEntry<OutputBundle extends Record<string, { name: string | undefined }>>(
  entryName: string,
  bundle: OutputBundle
): OutputBundle[string] | null {
  for (const key in bundle) {
    if (key.endsWith('.map')) continue // https://github.com/brillout/vite-plugin-ssr/issues/612
    const entry = bundle[key]!
    if (entry.name === entryName) return entry
  }
  return null
}
