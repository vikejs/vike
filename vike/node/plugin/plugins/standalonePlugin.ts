export { standalonePlugin }

import { existsSync } from 'fs'
import fs from 'fs/promises'
import { builtinModules } from 'module'
import path from 'path'
import { Plugin, searchForWorkspaceRoot } from 'vite'
import { pLimit } from '../../../utils/pLimit.js'
import { nativeDependecies } from '../shared/nativeDependencies.js'

function standalonePlugin({ serverEntry }: { serverEntry: string }): Plugin {
  let root = ''
  let outDir = ''

  const external = [...nativeDependecies, ...builtinModules, ...builtinModules.map((m) => `node:${m}`)]
  const noExternalRegex = new RegExp(`^(?!(${external.join('|')})$)`)

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
          external,
          noExternal: [noExternalRegex]
        },
        vitePluginImportBuild: {
          _disableAutoImporter: true
        }
      }
    },

    configResolved(config) {
      root = config.root
      outDir = config.build.outDir
    },

    renderChunk(code, chunk) {
      if (chunk.facadeModuleId === path.join(root, serverEntry)) {
        code = "import './importBuild.cjs'\n" + code
      }

      const needsRequire = !/require =/.test(code)
      const needsFilename = !/__filename =/.test(code)
      const needsDirname = !/__dirname =/.test(code)

      return (
        `import { dirname as dirname2 } from 'path';
      import { fileURLToPath as fileURLToPath2 } from 'url';
      import { createRequire as createRequire2 } from 'module';
      ${needsRequire ? 'var require = createRequire2(import.meta.url);' : ''}
      ${needsFilename ? 'var __filename = fileURLToPath2(import.meta.url);' : ''}
      ${needsDirname ? 'var __dirname = dirname2(__filename);' : ''}
      ` + code
      )
    },

    async closeBundle() {
      const outDirAbs = path.join(root, outDir)
      const workspaceRoot = searchForWorkspaceRoot(root)
      const relativeRoot = path.relative(workspaceRoot, root)
      const relativeDistDir = path.relative(workspaceRoot, outDir.split('/')[0]!)

      const entryNames = ['index.js', 'main.js', 'index.mjs', 'main.mjs']
      const entry = entryNames.map((e) => path.join(outDirAbs, e)).find((e) => existsSync(e))
      if (!entry) {
        return
      }

      const { nodeFileTrace } = await import('@vercel/nft')
      const result = await nodeFileTrace([entry], {
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
            const tracedFilePath = path.join(workspaceRoot, relativeFile)

            ///////////////////////////////////
            // This is to support pnpm monorepo
            let segments = 0
            if (relativeFile.startsWith(`${relativeRoot}/`) && !relativeFile.startsWith(relativeDistDir)) {
              segments = `${relativeRoot}/`.match(/\//g)?.length ?? 0
              relativeFile = relativeFile.replace(`${relativeRoot}/`, '')
            }
            ///////////////////////////////////

            const fileOutputPath = path.join(outDirAbs, relativeFile)

            if (!copiedFiles.has(fileOutputPath)) {
              copiedFiles.add(fileOutputPath)

              await fs.mkdir(path.dirname(fileOutputPath), { recursive: true })
              let symlink = await fs.readlink(tracedFilePath).catch(() => null)

              if (symlink) {
                ///////////////////////////////////
                // This is to support pnpm monorepo
                if (segments) {
                  const idx = symlink.split('/', segments).join('/').length + 1
                  symlink = symlink.substring(idx)
                }
                ///////////////////////////////////

                try {
                  await fs.symlink(symlink, fileOutputPath)
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
