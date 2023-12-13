export { standalonePlugin }

import esbuild from 'esbuild'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { Plugin, searchForWorkspaceRoot } from 'vite'
import { pLimit } from '../../../utils/pLimit.js'
import { nativeDependecies } from '../shared/nativeDependencies.js'
import { assert, toPosixPath, unique } from '../utils.js'

function standalonePlugin({ serverEntry }: { serverEntry: string }): Plugin {
  let root = ''
  let distDir = ''
  let outDir = ''
  let outDirAbs = ''
  let builtEntryAbs = ''

  const platform = os.platform()

  return {
    name: 'vike:standalone',
    apply(config, env) {
      //@ts-expect-error Vite 5 || Vite 4
      return !!(env.isSsrBuild || env.ssrBuild)
    },
    enforce: 'pre',
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
    configResolved(config) {
      root = toPosixPath(config.root)
      outDir = toPosixPath(config.build.outDir)
      distDir = outDir.split('/')[0]!
      outDirAbs = path.posix.join(root, outDir)
    },
    renderChunk(code, chunk) {
      if (chunk.facadeModuleId === path.posix.join(root, serverEntry)) {
        builtEntryAbs = path.posix.join(outDirAbs, chunk.fileName)
      }
    },
    async closeBundle() {
      const res = await esbuild.build({
        platform: 'node',
        format: 'esm',
        bundle: true,
        // Native dependencies can't be bundled, they will be discovered using nft, then copied
        external: nativeDependecies,
        entryPoints: { index: builtEntryAbs },
        outfile: builtEntryAbs,
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
        }
      })

      // The inputs of the bundled files are safe to remove
      const filesToRemove = Object.keys(res.metafile.inputs).filter(
        (relativeFile) => !builtEntryAbs.endsWith(relativeFile) && relativeFile.startsWith(distDir)
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

      //TODO: do we need this file?
      try {
        await fs.rm(path.posix.join(outDirAbs, 'importBuild.mjs'))
      } catch (error) {}

      const base = toPosixPath(searchForWorkspaceRoot(root))
      const relativeRoot = path.posix.relative(base, root)
      const relativeDistDir = path.posix.relative(base, distDir)

      const { nodeFileTrace } = await import('@vercel/nft')
      const result = await nodeFileTrace([builtEntryAbs], {
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
      const commonAncestor = findCommonAncestor(files)

      const concurrencyLimit = pLimit(10)
      const copiedFiles = new Set<string>()
      await Promise.all(
        files.map((relativeFile) =>
          concurrencyLimit(async () => {
            const tracedFilePath = path.posix.join(base, relativeFile)

            const fileOutputPath = path.posix.join(
              outDirAbs,
              relativeFile.replace(relativeRoot, '').replace(commonAncestor, '')
            )
            const isMonorepoSymlink = relativeFile.startsWith(relativeRoot)

            if (!copiedFiles.has(fileOutputPath)) {
              copiedFiles.add(fileOutputPath)
              await fs.mkdir(path.posix.dirname(fileOutputPath), { recursive: true })
              let symlink = await fs
                .readlink(tracedFilePath)
                .then(toPosixPath)
                .catch(() => null)

              // Convert the absolute symlink(which pnpm creates) to relative on Windows
              if (platform === 'win32' && symlink) {
                symlink = path.posix.relative(tracedFilePath, symlink).replace('../', '')
              }

              if (symlink) {
                if (isMonorepoSymlink) {
                  // the link would point outside of the project root, into ../../../node_modules/.pnpm
                  // the link needs to be changed, so it will point to ../node_modules/.pnpm
                  // count the occurences of / from the monorepo base to the project root
                  let projectDepthInMonorepo = 0
                  if (commonAncestor) {
                    projectDepthInMonorepo = relativeRoot.replace(`${commonAncestor}/`, '').split('/').length
                  } else {
                    projectDepthInMonorepo = relativeRoot.split('/').length
                  }
                  // for example ['../../../node_modules/.pnpm/sharp@0.32.6/node_modules/sharp'] will become
                  //             ['../node_modules/.pnpm/sharp@0.32.6/node_modules/sharp']
                  // remove [projectDepthInMonorepo times '../'] from the symlink
                  for (let index = 0; index < projectDepthInMonorepo; index++) {
                    symlink = symlink.substring(symlink.indexOf('/') + 1)
                  }

                  // another solution would be to just look for the first occurence of ['*./node_modules/.pnpm'] in the symlink,
                  // and  replace it with ['.pnpm']
                }
                try {
                  const isDir = (await fs.stat(tracedFilePath)).isDirectory()
                  await fs.symlink(symlink, fileOutputPath, isDir ? 'dir' : 'file')
                } catch (e: any) {
                  if (e.code !== 'EEXIST') {
                    throw e
                  }
                }
              } else {
                await fs.copyFile(tracedFilePath, fileOutputPath)
              }
            }
          })
        )
      )
    }
  }
}
function findCommonAncestor(paths: string[]) {
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
