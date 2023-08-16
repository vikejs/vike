export { extensionsAssets }

import type { Plugin, ResolvedConfig } from 'vite'
import type { ViteDevServer } from 'vite'
import { assert, isScriptFile, assertUsage, assertPosixPath, getOutDirs } from '../utils.js'
import fs from 'fs'
import path from 'path'
import sirv from 'sirv'
import type { ConfigVpsResolved } from '../../../shared/ConfigVps.js'
import { getConfigVps } from '../../shared/getConfigVps.js'
import { isAsset } from '../shared/isAsset.js'

const ASSET_DIR = 'assets'

function extensionsAssets(): Plugin {
  let config: ResolvedConfig
  let extensionsAssetsDir: string[]
  return {
    name: 'vite-plugin-ssr:extensionsAssets',
    async configResolved(config_) {
      config = config_
      const configVps = await getConfigVps(config)
      extensionsAssetsDir = getExtensionsAssetsDir(config, configVps)
    },
    configureServer(server) {
      if (extensionsAssetsDir.length > 0) {
        return () => {
          serveExtensionsAssets(server.middlewares, extensionsAssetsDir, config)
        }
      }
    },
    writeBundle() {
      if (!config.build.ssr && extensionsAssetsDir.length > 0) {
        copyExtensionsAssetsDir(config, extensionsAssetsDir)
      }
    }
  }
}

type ConnectServer = ViteDevServer['middlewares']
function serveExtensionsAssets(middlewares: ConnectServer, extensionsAssetsDirs: string[], config: ResolvedConfig) {
  assert(ASSET_DIR === getAsssetsDirConfig(config))
  extensionsAssetsDirs.forEach((assetsDir) => {
    const serve = sirv(assetsDir)
    middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith(`/${ASSET_DIR}/`)) {
        next()
        return
      }
      // https://github.com/lukeed/sirv/issues/148 - [Feature Request] New option base.
      req.url = '/' + req.url.slice(`/${ASSET_DIR}/`.length)
      serve(req, res, next)
    })
  })
}

function getExtensionsAssetsDir(config: ResolvedConfig, configVps: ConfigVpsResolved): string[] {
  const { extensions } = configVps
  const extensionsWithAssetsDir = extensions.filter(({ assetsDir }) => assetsDir)
  if (0 === extensionsWithAssetsDir.length) return []
  assertUsage(
    ASSET_DIR === getAsssetsDirConfig(config),
    'Cannot modify vite.config.js#build.assetsDir while using ' + extensionsWithAssetsDir[0]!.npmPackageName
  )
  const extensionsAssetsDir = extensionsWithAssetsDir.map(({ assetsDir }) => {
    assert(assetsDir)
    assertPosixPath(assetsDir)
    return assetsDir
  })
  return extensionsAssetsDir
}

function getAsssetsDirConfig(config: ResolvedConfig) {
  let { assetsDir } = config.build
  assertPosixPath(assetsDir)
  assetsDir = assetsDir.split('/').filter(Boolean).join('/')
  return assetsDir
}

function copyExtensionsAssetsDir(config: ResolvedConfig, extensionsAssetsDirs: string[]) {
  assert(ASSET_DIR === getAsssetsDirConfig(config))
  const { outDirClient } = getOutDirs(config)
  assertPosixPath(outDirClient)
  const outDirAssets = path.posix.join(outDirClient, ASSET_DIR)
  extensionsAssetsDirs.forEach((assetsDir) => {
    copyAssetFiles(assetsDir, outDirAssets)
  })
}

// Adapted from https://github.com/vitejs/vite/blob/e92d025cedabb477687d6a352ee8c9b7d529f623/packages/vite/src/node/utils.ts#L589-L604
function copyAssetFiles(srcDir: string, destDir: string): void {
  let destDirCreated = false
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    const stat = fs.statSync(srcFile)
    if (stat.isDirectory()) {
      copyAssetFiles(srcFile, destFile)
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
