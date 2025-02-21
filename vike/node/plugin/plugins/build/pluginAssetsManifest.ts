export { pluginAssetsManifest }

import { isV1Design } from '../importUserCode/v1-design/getVikeConfig.js'
import type { ResolvedConfig, Plugin, UserConfig, Rollup, Environment } from 'vite'
import fs from 'fs/promises'
import path from 'path'
import {
  fixServerAssets,
  fixServerAssets_assertUsageCssCodeSplit,
  fixServerAssets_assertUsageCssTarget,
  fixServerAssets_getBuildConfig,
  fixServerAssets_isEnabled,
  writeManifestFile
} from '../build/pluginAssetsManifest/fixServerAssets.js'
import { set_macro_ASSETS_MANIFEST } from './pluginBuildEntry.js'
import { getOutDirs, OutDirs } from '../../shared/getOutDirs.js'
import { viteIsServerBuildEnvAny, viteIsSSR } from '../../shared/viteIsSSR.js'
import { assert, assertIsSingleModuleInstance } from '../../utils.js'
type Bundle = Rollup.OutputBundle
type Options = Rollup.NormalizedOutputOptions
const manifestTempFile = '_temp_manifest.json'

function pluginAssetsManifest(): Plugin[] {
  let config: ResolvedConfig

  return [
    {
      name: 'vike:build:pluginAssetsManifest:post',
      apply: 'build',
      enforce: 'post',
      configResolved: {
        order: 'post',
        handler(config_) {
          config = config_
          fixServerAssets_assertUsageCssCodeSplit(config)
        }
      },
      config: {
        order: 'post',
        handler(config) {
          return {
            build: {
              ...fixServerAssets_getBuildConfig(config)
            }
          } satisfies UserConfig
        }
      },
      async closeBundle() {
        await fixServerAssets_assertUsageCssTarget(config)
      }
    },
    {
      name: 'vike:build:pluginAssetsManifest:pre',
      apply: 'build',
      // Make sure other writeBundle() hooks are called after this writeBundle() hook.
      //  - set_macro_ASSETS_MANIFEST() needs to be called before dist/server/ code is executed.
      //    - For example, the writeBundle() hook of vite-plugin-vercel needs to be called after this writeBundle() hook, otherwise: https://github.com/vikejs/vike/issues/1527
      enforce: 'pre',
      writeBundle: {
        order: 'pre',
        sequential: true,
        async handler(options, bundle) {
          await handleAssetsManifest(config, this.environment, options, bundle)
        }
      }
    }
  ]
}

assertIsSingleModuleInstance('ewq/TODO.ts')
let assetsJsonFilePath: string | undefined

async function handleAssetsManifest(
  config: ResolvedConfig,
  viteEnv: Environment | undefined,
  options: Options,
  bundle: Bundle
) {
  if (viteIsSSR(config, viteEnv)) {
    assert(!assetsJsonFilePath)
    const outDirs = getOutDirs(config, viteEnv)
    assetsJsonFilePath = path.posix.join(outDirs.outDirRoot, 'assets.json')
    await writeAssetsManifestFile(outDirs, assetsJsonFilePath, config)
  }
  if (viteIsServerBuildEnvAny(config, viteEnv)) {
    assert(assetsJsonFilePath)
    // Replace __VITE_ASSETS_MANIFEST__ in all server-side bundles
    await set_macro_ASSETS_MANIFEST(options, bundle, assetsJsonFilePath)
  }
}

async function writeAssetsManifestFile(outDirs: OutDirs, assetsJsonFilePath: string, config: ResolvedConfig) {
  const isServerAssetsFixEnabled = fixServerAssets_isEnabled() && isV1Design(config)
  const clientManifestFilePath = path.posix.join(outDirs.outDirClient, manifestTempFile)
  const serverManifestFilePath = path.posix.join(outDirs.outDirServer, manifestTempFile)
  if (!isServerAssetsFixEnabled) {
    await fs.copyFile(clientManifestFilePath, assetsJsonFilePath)
  } else {
    const { clientManifestMod } = await fixServerAssets(config)
    await writeManifestFile(clientManifestMod, assetsJsonFilePath)
  }
  await fs.rm(clientManifestFilePath)
  await fs.rm(serverManifestFilePath)
}
