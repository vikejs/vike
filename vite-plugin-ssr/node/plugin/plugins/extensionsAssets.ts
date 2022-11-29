export { extensionsAssets }

import type { Plugin, ResolvedConfig } from 'vite'
import type { ViteDevServer } from 'vite'
import { assert, isAsset, isScriptFile } from '../utils'
import fs from 'fs'
import path from 'path'
import sirv from 'sirv'
import { ConfigVpsResolved } from './config/ConfigVps'
import { getConfigVps } from './config/assertConfigVps'

function extensionsAssets(): Plugin {
  let config: ResolvedConfig
  let configVps: ConfigVpsResolved
  return {
    name: 'vite-plugin-ssr:extensionsAssets',
    async configResolved(config_) {
      config = config_
      configVps = await getConfigVps(config)
    },
    configureServer(server) {
      return () => {
        serveExtensionsAssets(server.middlewares, configVps)
      }
    },
    async writeBundle() {
      if (config.build.ssr) {
        return
      }
      const outDirClient = path.posix.join(config.root, config.build.outDir)
      assert(outDirClient.endsWith('/client'), outDirClient)
      configVps.extensions.forEach(({ assetsDir }) => {
        if (assetsDir) {
          copyAssets(assetsDir, outDirClient)
        }
      })
    }
  }
}

type ConnectServer = ViteDevServer['middlewares']
function serveExtensionsAssets(middlewares: ConnectServer, configVps: ConfigVpsResolved) {
  configVps.extensions.forEach(({ assetsDir }) => {
    if (assetsDir) {
      middlewares.use(async (req, res, next) => {
        const serve = sirv(assetsDir)
        serve(req, res, next)
      })
    }
  })
}

// Adapted from https://github.com/vitejs/vite/blob/e92d025cedabb477687d6a352ee8c9b7d529f623/packages/vite/src/node/utils.ts#L589-L604
function copyAssets(srcDir: string, destDir: string): void {
  let destDirCreated = false
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    const stat = fs.statSync(srcFile)
    if (stat.isDirectory()) {
      copyAssets(srcFile, destFile)
    } else if (isAsset(srcFile)) {
      assert(!isScriptFile(srcFile))
      if (!destDirCreated) {
        fs.mkdirSync(destDir, { recursive: true })
        destDirCreated = true
      }
      fs.copyFileSync(srcFile, destFile)
    }
  }
}
