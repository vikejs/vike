export { pluginAssetsManifest }

import type { ResolvedConfig, Plugin, UserConfig } from 'vite'
import {
  fixServerAssets_assertUsageCssCodeSplit,
  fixServerAssets_assertUsageCssTarget,
  fixServerAssets_getBuildConfig,
  handleAssets
} from '../build/pluginAssetsManifest/fixServerAssets.js'

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
      closeBundle() {
        fixServerAssets_assertUsageCssTarget(config)
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
          await handleAssets(config, this.environment, options, bundle)
        }
      }
    }
  ]
}
