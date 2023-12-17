export { ssrEmitAssetsPlugin }

import type { Plugin } from 'vite'
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'

function ssrEmitAssetsPlugin(): Plugin {
  let outDirServerAbs = ''
  let outDirClientAbs = ''

  return {
    name: 'vike:ssrEmitAssets',
    enforce: 'post',
    apply(config, env) {
      //@ts-expect-error Vite 5 || Vite 4
      return !!(env.isSsrBuild || env.ssrBuild)
    },
    config(config, env) {
      return {
        build: {
          ssrEmitAssets: true,
          ssrManifest: true,
          cssMinify: 'esbuild'
        }
      }
    },
    configResolved(config) {
      outDirServerAbs = path.posix.join(config.root, config.build.outDir)
      outDirClientAbs = path.posix.resolve(outDirServerAbs, '..', 'client')
    },
    async closeBundle() {
      const assetsDirServerAbs = path.posix.join(outDirServerAbs, 'assets')
      const assetsDirClientAbs = path.posix.join(outDirClientAbs, 'assets')

      if (!existsSync(assetsDirServerAbs)) {
        return
      }

      await fs.cp(assetsDirServerAbs, assetsDirClientAbs, { recursive: true, force: true })
      // await fs.rm(assetsDirServerAbs, { recursive: true })
    }
  }
}
