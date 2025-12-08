export { pluginModuleBanner }

import type { ResolvedConfig, Plugin } from 'vite'
import { assert, removeVirtualFileIdPrefix } from '../../utils.js'
import { getMagicString } from '../../shared/getMagicString.js'

// (Mis)-using legal comments so that esbuild doesn't remove them.
// - Legal comments: https://esbuild.github.io/api/#legal-comments
// - Terser removes legal comments, but I guess users use terser to minify JavaScript so I guess it's a good thing that comment is removed.
// - Rollup's banner feature doesn't work with Vite: https://github.com/vitejs/vite/issues/8412
//   - But, anyways, we want to prepend the banner at the beginning of each module, not at the beginning of each file (I believe that's what Rollup's banner feature does).
// - Potential alternative: https://github.com/vitejs/vite/issues/21228#issuecomment-3627899741

function pluginModuleBanner(): Plugin[] {
  let config: ResolvedConfig
  let isEnabled = false
  return [
    {
      name: 'vike:build:pluginModuleBanner',
      enforce: 'post',
      apply: 'build',
      applyToEnvironment(environment) {
        return checkIsEnabled(environment.config)
      },
      configResolved: {
        handler(config_) {
          config = config_
          isEnabled = checkIsEnabled(config)
        },
      },
      transform: {
        order: 'post',
        filter: {
          get id() {
            return isEnabled ? undefined : 'this-module-id-does-not-exist-and-never-matches-any-module'
          },
        },
        handler(code, id) {
          if (!isEnabled) return undefined
          const { minify } = this.environment.config.build
          assert(minify === false, { minify })
          if (id.startsWith('\0')) id = id
          id = removeVirtualFileIdPrefix(id)
          if (id.startsWith(config.root)) id = id.slice(config.root.length + 1)
          id = id.replaceAll('*/', '*\\/') // https://github.com/vikejs/vike/issues/2377
          const { magicString, getMagicStringResult } = getMagicString(code, id)
          magicString.prepend(`/*! ${id} [vike:pluginModuleBanner] */\n`)
          return getMagicStringResult()
        },
      },
    },
  ]
}

function checkIsEnabled(config: ResolvedConfig) {
  const { minify } = config.build
  assert(minify === false || minify, { minify })
  const isEnabled = !minify
  // Avoid the legal comments inserted in the transform() hook to be removed.
  // https://github.com/vitejs/vite/issues/21085#issuecomment-3502781005
  if (isEnabled && config.esbuild) config.esbuild.legalComments = 'inline'
  return isEnabled
}
