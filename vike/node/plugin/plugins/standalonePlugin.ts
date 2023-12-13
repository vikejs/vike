export { standalonePlugin }

import esbuild from 'esbuild'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { Plugin, searchForWorkspaceRoot } from 'vite'
import { pLimit } from '../../../utils/pLimit.js'
import { nativeDependecies } from '../shared/nativeDependencies.js'
import { unique } from '../utils.js'

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
      root = config.root
      outDir = config.build.outDir
      distDir = outDir.split('/')[0]!
      outDirAbs = path.posix.join(root, outDir)
    },

    renderChunk(code, chunk) {
      if (chunk.facadeModuleId === path.posix.join(root, serverEntry)) {
        builtEntryAbs = path.posix.join(outDirAbs, chunk.fileName)
      }
      return code
    },

    async closeBundle() {
      const res = await esbuild.build({
        platform: 'node',
        format: 'esm',
        bundle: true,
        // These will be copied using nft
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

      // The bundled files are safe to remove
      const filesToRemove = Object.keys(res.metafile.inputs).filter(
        (relativeFile) => !builtEntryAbs.endsWith(relativeFile) && relativeFile.startsWith(distDir)
      )
      for (const relativeFile of filesToRemove) {
        await fs.rm(path.posix.join(root, relativeFile))
      }

      // Remove empty dirs of the removed bundled files
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

      const workspaceRoot = searchForWorkspaceRoot(root).replace(/\\/g, '/')
      const relativeRoot = path.relative(workspaceRoot, root).replace(/\\/g, '/')
      const relativeDistDir = path.relative(workspaceRoot, distDir).replace(/\\/g, '/')

      const { nodeFileTrace } = await import('@vercel/nft')
      const result = await nodeFileTrace([builtEntryAbs], {
        base: workspaceRoot,
        processCwd: workspaceRoot
      })

      const tracedDeps = new Set<string>()
      for (const file of result.fileList) {
        if (result.reasons.get(file)?.type.includes('initial')) {
          continue
        }
        tracedDeps.add(file.replace(/\\/g, '/'))
      }

      const files = [...tracedDeps].filter((path) => !path.startsWith(relativeDistDir))

      const concurrencyLimit = pLimit(10)
      const copiedFiles = new Set<string>()

      await Promise.all(
        files.map((relativeFile) =>
          concurrencyLimit(async () => {
            const tracedFilePath = path.posix.join(workspaceRoot, relativeFile)

            /////////////////////////////////
            // This is to support pnpm monorepo
            let segments = 0
            if (relativeFile?.startsWith(`${relativeRoot}/`) && !relativeFile.startsWith(relativeDistDir)) {
              segments = `${relativeRoot}/`.match(/\//g)?.length ?? 0
              relativeFile = relativeFile.replace(`${relativeRoot}/`, '')
            }
            /////////////////////////////////

            const fileOutputPath = path.posix.join(outDirAbs, relativeFile)

            if (!copiedFiles.has(fileOutputPath)) {
              copiedFiles.add(fileOutputPath)

              await fs.mkdir(path.posix.dirname(fileOutputPath), { recursive: true })

              let symlink = await fs.readlink(tracedFilePath).catch(() => null)
              /////////////////////////////////
              // This is to convert the absolute symlink to relative on Windows
              if (platform === 'win32' && symlink) {
                symlink = symlink.replace(/\\/g, '/')
                symlink = path.posix.relative(`${tracedFilePath}/`, symlink).replace('../', '')
              }
              /////////////////////////////////

              if (symlink) {
                /////////////////////////////////
                // This is to support pnpm monorepo
                if (segments) {
                  const idx = symlink.split('/', segments).join('/').length + 1
                  symlink = symlink.substring(idx)
                }
                /////////////////////////////////

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
