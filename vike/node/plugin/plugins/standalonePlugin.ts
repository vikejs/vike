export { standalonePlugin }

import esbuild from 'esbuild'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { Plugin, searchForWorkspaceRoot } from 'vite'
import { pLimit } from '../../../utils/pLimit.js'
import { assert, assertUsage, toPosixPath, unique } from '../utils.js'
import { getConfigVike } from '../../shared/getConfigVike.js'

function standalonePlugin({ serverEntry }: { serverEntry: string }): Plugin {
  let root = ''
  let distDir = ''
  let outDir = ''
  let outDirAbs = ''
  let builtEntryAbs = ''

  // Native dependencies always need to be esbuild external
  let native: string[] = []

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
    async configResolved(config) {
      const configVike = await getConfigVike(config)
      native = configVike.native
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
        external: native,
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

      await fs.rm(path.posix.join(outDirAbs, 'importBuild.mjs')).catch(() => {})
      await fs.rm(path.posix.join(outDirAbs, 'importBuild.cjs')).catch(() => {})

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

            const fileOutputPath = path.posix.join(
              outDirAbs,
              relativeFile.replace(relativeRoot, '').replace(commonAncestor, '')
            )

            if (!copiedFiles.has(fileOutputPath)) {
              copiedFiles.add(fileOutputPath)
              await fs.mkdir(path.posix.dirname(fileOutputPath), { recursive: true })
              let symlink = await fs
                .readlink(tracedFilePath)
                .then(toPosixPath)
                .catch(() => null)

              if (symlink) {
                // Convert the absolute symlink(which pnpm creates) to relative on Windows
                if (platform === 'win32' && /^\w:/.test(symlink)) {
                  symlink = path.posix.relative(tracedFilePath, symlink).replace('../', '')
                }

                const maximumAllowedUpDirs = path.posix.relative(outDirAbs, fileOutputPath).split('/').length
                let symlinkPointsOutsideDist = symlink.split('../').length - 1 > maximumAllowedUpDirs
                if (symlinkPointsOutsideDist) {
                  let projectDepthInMonorepo = 0

                  // the link would point outside of dist, into ../../../node_modules/.pnpm
                  // the link needs to be changed, so it will point to ../node_modules/.pnpm, inside dist
                  // count the occurences of / from the monorepo base to the project root
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

                  symlinkPointsOutsideDist = symlink.split('../').length - 1 > maximumAllowedUpDirs

                  assert(!symlinkPointsOutsideDist, {
                    base,
                    root,
                    relativeRoot,
                    relativeFile,
                    outDirAbs,
                    projectDepthInMonorepo,
                    tracedFilePath,
                    symlink,
                    fileOutputPath
                  })
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
