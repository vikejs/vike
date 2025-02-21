export { assetsManifestPlugin }

import { isV1Design } from '../importUserCode/v1-design/getVikeConfig.js'
import type { ResolvedConfig, Plugin, UserConfig } from 'vite'
import fs from 'fs/promises'
import path from 'path'
import {
  fixServerAssets,
  fixServerAssets_assertUsageCssCodeSplit,
  fixServerAssets_assertUsageCssTarget,
  fixServerAssets_isEnabled
} from '../buildConfig/assetsManifestPlugin/fixServerAssets.js'
import { set_macro_ASSETS_MANIFEST } from '../buildEntry/index.js'
import { getOutDirs, type OutDirs } from '../../shared/getOutDirs.js'
import { viteIsSSR } from '../../shared/viteIsSSR.js'
import { getVikeConfigPublic } from '../commonConfig.js'
const manifestTempFile = '_temp_manifest.json'

function assetsManifestPlugin(): Plugin[] {
  let isServerAssetsFixEnabled: boolean
  let config: ResolvedConfig
  let assetsJsonFilePath: string

  return [
    {
      name: 'vike:buildConfig:assets-manifest:post',
      apply: 'build',
      enforce: 'post',
      configResolved: {
        order: 'post',
        async handler(config_) {
          config = config_
          isServerAssetsFixEnabled = fixServerAssets_isEnabled() && (await isV1Design(config))
          if (isServerAssetsFixEnabled) {
            // https://github.com/vikejs/vike/issues/1339
            config.build.ssrEmitAssets = true
            // Required if `ssrEmitAssets: true`, see https://github.com/vitejs/vite/pull/11430#issuecomment-1454800934
            config.build.cssMinify = 'esbuild'
            fixServerAssets_assertUsageCssCodeSplit(config)
          }
        }
      },
      config: {
        order: 'post',
        handler(config) {
          const vike = getVikeConfigPublic(config)
          return {
            build: {
              manifest: manifestTempFile,
              copyPublicDir: vike.config.viteEnvironmentAPI
                ? // Already set by vike:buildApp plugin
                  undefined
                : !viteIsSSR(config)
            }
          } satisfies UserConfig
        }
      },
      async closeBundle() {
        await fixServerAssets_assertUsageCssTarget(config)
      }
    },
    {
      name: 'vike:buildConfig:assets-manifest:pre',
      apply: 'build',
      // Compatiblity with Environment API. It replaces `vike:buildConfig:assets-manifest:pre` when compatible
      // See https://vite.dev/guide/api-environment-plugins.html#per-environment-plugins
      applyToEnvironment() {
        return {
          name: 'vike:buildConfig:assets-manifest:pre:env-api-compat',
          apply: 'build',
          enforce: 'pre',
          writeBundle: {
            order: 'pre',
            sequential: true,
            async handler(options, bundle) {
              if (this.environment.name === 'ssr') {
                await writeAssetsManifestFile(getOutDirs(this.environment.config))
              }
              if (viteIsSSR(this.environment.config)) {
                // Replace __VITE_ASSETS_MANIFEST__ in all server-side bundles
                await set_macro_ASSETS_MANIFEST(options, bundle, assetsJsonFilePath)
              }
            }
          }
        }
      },
      // Ensures that we can reuse `assetsJsonFilePath`
      sharedDuringBuild: true,
      // Make sure other writeBundle() hooks are called after this writeBundle() hook.
      //  - set_macro_ASSETS_MANIFEST() needs to be called before dist/server/ code is executed.
      //    - For example, the writeBundle() hook of vite-plugin-vercel needs to be called after this writeBundle() hook, otherwise: https://github.com/vikejs/vike/issues/1527
      enforce: 'pre',
      writeBundle: {
        order: 'pre',
        sequential: true,
        async handler(options, bundle) {
          if (viteIsSSR(config)) {
            await writeAssetsManifestFile(getOutDirs(config))
            await set_macro_ASSETS_MANIFEST(options, bundle, assetsJsonFilePath)
          }
        }
      }
    }
  ]

  // Ideally we'd move dist/_temp_manifest.json to dist/server/client-assets.json instead of dist/assets.json
  //  - But we can't because there is no guarentee whether dist/server/ is generated before or after dist/client/ (generating dist/server/ after dist/client/ erases dist/server/client-assets.json)
  //  - We'll able to do so once we replace `$ vite build` with `$ vike build`
  async function writeAssetsManifestFile(outDirs: OutDirs) {
    assetsJsonFilePath = path.posix.join(outDirs.outDirRoot, 'assets.json')
    const clientManifestFilePath = path.posix.join(outDirs.outDirClient, manifestTempFile)
    const serverManifestFilePath = path.posix.join(outDirs.outDirServer, manifestTempFile)
    if (!isServerAssetsFixEnabled) {
      await fs.copyFile(clientManifestFilePath, assetsJsonFilePath)
    } else {
      const { clientManifestMod } = await fixServerAssets(config)
      await fs.writeFile(assetsJsonFilePath, JSON.stringify(clientManifestMod, null, 2), 'utf-8')
    }
    await fs.rm(clientManifestFilePath)
    await fs.rm(serverManifestFilePath)
  }
}
