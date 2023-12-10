export { standalonePlugin }

import { existsSync } from 'fs'
import fs from 'fs/promises'
import { builtinModules } from 'module'
import path from 'path'
import { Plugin, searchForWorkspaceRoot } from 'vite'
import { pLimit } from '../../../utils/pLimit.js'

function standalonePlugin(): Plugin {
  let root = ''
  let outDir = ''

  // Need to list native dependencies here
  const external = [
    'sharp',
    '@generated/prisma',
    '@prisma/client',
    '@node-rs/argon2',
    '@brillout/vite-plugin-import-build',
    ...builtinModules,
    ...builtinModules.map((m) => `node:${m}`)
  ]
  const noExternalRegex = new RegExp(`^(?!(${external.join('|')})$)`)

  return {
    name: 'vike:standalone',
    apply(config, env) {
      //@ts-expect-error Vite 5 || Vite 4
      return !!(env.isSsrBuild || env.ssrBuild)
    },
    enforce: 'post',
    config(config, env) {
      return {
        ssr: {
          external,
          noExternal: [noExternalRegex]
        }
      }
    },

    configResolved(config) {
      root = config.root
      outDir = config.build.outDir
    },

    async closeBundle() {
      const outDirAbs = path.join(root, outDir)
      const workspaceRoot = searchForWorkspaceRoot(root)
      const relativeRoot = path.relative(workspaceRoot, root)

      const entryNames = ['index.js', 'main.js', 'index.mjs', 'main.mjs']
      const entry = entryNames.map((e) => path.join(outDirAbs, e)).find((e) => existsSync(e))
      if (!entry) {
        return
      }

      //TODO: do we need this?
      //       const banner = `
      // import { dirname as dirname2 } from 'path';
      // import { fileURLToPath as fileURLToPath2 } from 'url';
      // import { createRequire as createRequire2 } from 'module';
      // var __filename = fileURLToPath2(import.meta.url);
      // var __dirname = dirname2(__filename);
      // var require = createRequire2(import.meta.url);
      //       `

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
      const files = [...tracedDeps]

      const concurrencyLimit = pLimit(10)
      const copiedFiles = new Set<string>()

      await Promise.all(
        files.map((relativeFile) =>
          concurrencyLimit(async () => {
            const tracedFilePath = path.join(workspaceRoot, relativeFile)

            ///////////////////////////////////
            // This is to support pnpm monorepo
            let segments = 0
            if (relativeFile.startsWith(`${relativeRoot}/`)) {
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
